import { TrackerHeader } from "@/components/tracker/TrackerHeader";
import { TrackerStats } from "@/components/tracker/TrackerStats";
import { TrackerKanban } from "@/components/tracker/TrackerKanban";
import { TrackerTimeline } from "@/components/tracker/TrackerTimeline";
import { TrackerActivity } from "@/components/tracker/TrackerActivity";
import { TrackerInsights } from "@/components/tracker/TrackerInsights";

export default function TrackerPage() {
  return (
    <div className="flex flex-col h-full p-8 space-y-8">
      <TrackerHeader />
      <TrackerStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrackerKanban />
        <TrackerTimeline />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrackerActivity />
        <TrackerInsights />
      </div>
    </div>
  );
}
