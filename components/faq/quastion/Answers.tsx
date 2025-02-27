import UserInformation from "@/components/UserInformaton";
import { Answer } from "@/type/types";

const OneAnswer = ({ answer }: { answer?: Answer[] }) => {
  if (!answer) return null;

  return (
    <div className="flex flex-col gap-2 w-full  items-end p-4 ">
      <div className="flex flex-row items-baseline  gap-2 w-[97%]  ">
        <UserInformation email={answer[0].userEmail || undefined} showName={false} />
        <p className="text-sm text-muted-foreground text-wrap">
          {answer[0].content}
        </p>
      </div>
    </div>
  );
};
export default OneAnswer;