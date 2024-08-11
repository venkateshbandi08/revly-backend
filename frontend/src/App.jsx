import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import CircularBar from "./components/CircularBar";
import Loader from "./components/Loader";

const App = () => {
  const [data, setData] = useState({
    accessibilityScore: 0,
    pageLoadTime: 0,
    performanceScore: 0,
    bestPracticesScore: 0,
    seoScore: 0,
    totalRequestSize: 0,
    totalRequests: 0,
  });
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      if (url === "") {
        toast.error("Invalid url!", { duration: 1000 });
        return;
      }
      const res = await axios.post(
        import.meta.env.VITE_BACKEND + "/api/performance/analyze",
        { url }
      );
      if (res.status === 200) {
        const { data } = res;
        console.log(data);
        if (data.success) {
          setData({ ...data?.data });
        }
      }
    } catch (error) {
      const { response } = error;
      toast.error(response.data.message, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col gap-4 min-h-dvh min-w-[300px] p-4">
      <h1
        style={{ textAlign: "center" }}
        className="text-black text-4xl font-semibold"
      >
        WebSite performance Analyzer
      </h1>

      <div className="self-center flex flex-col gap-5 w-[80%] mt-10">
        <input
          placeholder="e.g: https://youtube.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className=" h-14 rounded-lg outline-none pl-2 font-normal text-lg text-black bg-slate-200 border border-black"
        />
        <button
          onClick={handleAnalyze}
          className="bg-orange-400 self-center h-12 text-lg  rounded-lg text-Lime-500 font-normal cursor-pointer p-6 flex justify-center items-center"
        >
          Analyze
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="text-black self-center  mt-[100px] mb-[40px] text-xl flex flex-col gap-3 w-[80%]">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-600">Load Time:</p>
              <p className="">{data?.pageLoadTime.toFixed(2)} ms</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-600">
                Total Requests Size:
              </p>
              <p>{data?.totalRequestSize} bytes</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-600">Total Requests:</p>
              <p>{data?.totalRequests}</p>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-10 self-center p-3">
            <CircularBar
              name={"Accessibility"}
              progress={data?.accessibilityScore.toFixed(0)}
              size={120}
              strokeWidth={14}
            />
            <CircularBar
              name={"Best Practices"}
              progress={data?.bestPracticesScore.toFixed(0)}
              size={120}
              strokeWidth={14}
            />
            <CircularBar
              name={"Performance"}
              progress={data?.performanceScore.toFixed(0)}
              size={120}
              strokeWidth={14}
            />
            <CircularBar
              name={"SEO"}
              progress={data?.seoScore.toFixed(0)}
              size={120}
              strokeWidth={14}
            />
          </div>
        </>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
