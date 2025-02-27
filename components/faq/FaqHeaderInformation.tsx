import { FaqItem } from "@/type/types";
import { dateToString } from "@/lib/nadish";
import { Icon } from "@iconify/react";

// New ViewerCountDisplay component
const ViewerCountDisplay = ({ viewerCount }: { viewerCount: number }) => (
  <div className="rounded-md text-sm text-muted-foreground flex items-center justify-center w-9 h-5 border gap-1 px-1 bg-secondary border-border">
    <Icon icon="lucide:eye" className="w-3 h-3" />
    <p className="text-[10px]">{viewerCount}</p>
  </div>
);

// New DateDisplay component
const DateDisplay = ({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) => (
  <div className="text-[10px]   text-muted-foreground flex items-center gap-2 w-fit ">
    <Icon icon="lucide:edit" className="w-3 h-3 " />
    {dateToString(updatedAt.toString())}
  </div>
  // </div>
);

const FaqHeaderInformation = ({ item }: { item: FaqItem }) => (
  <div className=" flex  flex-row items-center   justify-between w-full bg-secondary p-2 rounded-md ">
    <ViewerCountDisplay viewerCount={item.viewerCount} />
    <DateDisplay createdAt={item.createdAt} updatedAt={item.updatedAt} />
  </div>
);
export default FaqHeaderInformation;
