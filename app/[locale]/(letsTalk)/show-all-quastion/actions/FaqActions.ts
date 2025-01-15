import { unstable_cache } from "next/cache";
import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  questionQueryMode,
  questionStatus,
} from "../../../../../constant/enums";
import { SortOption } from "./Faqtypes";

interface GetQuestionsParams {
  tag: string;
  search: string;
  querymode: questionQueryMode;
  status: questionStatus;
  page?: number;
  limit?: number;
  sortKey?: SortOption;
  sortDirection?: "asc" | "desc";
}

interface GetQuestionsResult {
  QuestionsWithAnswers: any[];
  QueryCont: number;
  pagesCount: number;
  tags: { tag: string; count: number }[];
  totalCount: number;
}

/**
 * Builds the WHERE condition for the Prisma query based on the provided parameters.
 */
function buildWhereCondition(
  tag: string,
  search: string,
  querymode: questionQueryMode,
  status: questionStatus
): Prisma.faqWhereInput {
  const baseCondition: Prisma.faqWhereInput = {};

  switch (status) {
    case questionStatus.PUBLISHED:
      baseCondition.published = true;
      baseCondition.rejected = false;
      baseCondition.gotAnswer = false;
      break;
    case questionStatus.REJECTED:
      baseCondition.rejected = true;
      break;
    case questionStatus.ANSWERED:
      baseCondition.published = true;
      baseCondition.rejected = false;
      baseCondition.gotAnswer = true;
      break;
    case questionStatus.PENDING:
      baseCondition.published = true;
      baseCondition.rejected = false;
      baseCondition.gotAnswer = false;
      break;
    default:
      throw new Error(`Invalid status: ${status}`);
  }

  if (tag !== "all") {
    baseCondition.tagged = {
      some: {
        tag: {
          equals: tag.toLowerCase(),
        },
      },
    };
  }

  if (search) {
    if (querymode === questionQueryMode.QUESTIONS) {
      baseCondition.question = {
        contains: search,
        mode: Prisma.QueryMode.insensitive,
      };
    } else {
      baseCondition.answers = {
        some: {
          content: search,
        },
      };
    }
  }

  return baseCondition;
}

/**
 * Fetches questions from the database based on the provided parameters.
 */
export async function GetQuestions({
  tag,
  search,
  querymode,
  status,
  page = 1,
  limit = 10,
  sortKey = "createdAt",
  sortDirection = "desc",
}: GetQuestionsParams): Promise<GetQuestionsResult> {
  const skip = (page - 1) * limit;
  const whereCondition = buildWhereCondition(tag, search, querymode, status);

  const orderByClause: Prisma.faqOrderByWithRelationInput = {};
  orderByClause[sortKey] = sortDirection;

  try {
    // Fetch total count of questions
    const QueryCont = await db.faq.count({
      where: whereCondition,
    });

    // Calculate total pages
    const pagesCount = Math.ceil(QueryCont / limit);

    // Fetch paginated questions with related data
    const QuestionsWithAnswers = await db.faq.findMany({
      where: whereCondition,
      include: {
        answers: { include: { comments: true } },
        tagged: true,
        images: true,
        voiceRecordings: true,
        faqInteractions: true,
      },
      orderBy: orderByClause,
      skip,
      take: limit,
    });

    // Fetch tags and their counts (cached)
    const { tags, totalCount } = await countTagsInFaq();

    return { QuestionsWithAnswers, QueryCont, pagesCount, tags, totalCount };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions.");
  }
}

/**
 * Counts the occurrences of each tag in the `tagged` table and returns the results.
 * Results are cached for 1 hour.
 */
export const countTagsInFaq = unstable_cache(
  async () => {
    try {
      // Fetch tag counts from the database
      const tagCounts = await db.tagged.groupBy({
        by: ["tag"],
        _count: {
          tag: true, // Count the occurrences of each tag
        },
        orderBy: {
          _count: {
            tag: "desc", // Sort by count in descending order
          },
        },
      });

      // Map the results to a more usable format
      const tags = tagCounts.map(({ tag, _count }) => ({
        tag,
        count: _count.tag, // Use the count of the tag
      }));

      // Calculate the total count of all tags
      const totalCount = tags.reduce((sum, { count }) => sum + count, 0);

      return { tags, totalCount };
    } catch (error) {
      console.error("Error counting tags:", error);
      throw new Error("Failed to count tags.");
    }
  },
  ["countTagsInFaq"], // Cache key (unique identifier for this function)
  {
    revalidate: 3600, // Revalidate the cache every 1 hour (in seconds)
  }
);
