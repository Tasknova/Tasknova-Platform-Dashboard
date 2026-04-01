import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export function MeetingDetail() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Meeting Detail</h1>
          <p className="text-gray-600 mt-1">Detailed meeting view with transcript and insights</p>
        </div>
      </div>
    </div>
  );
}