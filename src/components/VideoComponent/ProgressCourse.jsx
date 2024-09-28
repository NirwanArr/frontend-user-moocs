/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import ProgressBar from "../MyCourseComponent/ProgressBar";
import ChapterItem from "./ChapterItem";
import { cn } from "../../libs/utils";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  getPembayaran,
  historyTransaksi,
} from "../../api/fetching";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Swal from "sweetalert2";
// import { Shield } from "lucide-react";
import { PiShieldStarBold } from "react-icons/pi";
import { FaStar } from "react-icons/fa";

function convertToRupiah(angka) {
  var rupiah = "";
  var angkarev = angka.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++)
    if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ".";
  return (
    "Rp. " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
}

const ProgressCourse = ({
  isOpen,
  chapters,
  handleVideoLink,
  contentStatus,
  onVideoClick,
  setIsloading,
  setClickedContentIndex,
}) => {
  if (!chapters) {
    return null;
  }
  if (typeof handleVideoLink !== "function") {
    console.error("handleVideoLink is not a function");
    return null;
  }
  const chapter = chapters.chapters;

  const [isActive, setIsActive] = useState({
    title: 0,
    chapter: 0,
  });

  const [defaultOpen, setInsopen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [DataHistoryTransaksi, setDataHistoryTransaksi] = useState();
  const geID = useParams();

  const onHistoryTransaksi = async () => {
    try {
      const data = await historyTransaksi();
      setInsopen(false);
      setDrawerOpen(true);
      setDataHistoryTransaksi(data);
    } catch (error) { }
  };

  const onCloseDrawer = () => {
    setDrawerOpen((a) => !a);
  };

  const nav = useNavigate();

  const onCreateCourse = async () => {
    try {
      const res = await createCourse(geID.courseId);
      Swal.fire({
        title: "Berhasil!",
        text: "Kursus berhasil dibuat.",
        icon: "success",
        confirmButtonText: "OK",
        didClose: () => {
          nav("/mycourse/list");
        },
        showClass: "bg-blue-500",
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "OK",
        didClose: () => {
          nav("/mycourse/list");
        },
      });
    }
  };

  useEffect(() => {
    console.log(chapters?.courseUserId);
    if (chapters?.courseUserId) {
      window.location.href = `/video/list/${chapters?.courseUserId}`;
    }
    // /video/list/6
  }, [chapters]);

  return (
    <>
      <div
        className={cn(
          "absolute -top-[100vh] space-y-3 left-0 right-0 rounded-b-lg md:rounded-none lg:sticky lg:top-24 duration-500 transition-all",
          isOpen && "top-[80px] md:top-6"
        )}
      >
        {chapters.courseStatus === "Selesai" ? (
          <div className="p-4  bg-green-300 font-bold">
            Kelas sudah selesai
          </div>
        ) : chapters.courseStatus !== "inProgress" ? (
          chapters.courseType !== "Free" ? (
            <div>
              <Popup
                open={defaultOpen}
                contentStyle={{
                  minWidth: "450px",
                  maxWidth: "450px",
                }}
                // onOpen={onPembayaran}
                trigger={
                  <button className="w-full rounded text-xs lg:text-sm py-3 bg-[#0092A4] text-white font-semibold flex justify-center items-center hover:bg-[#0092A4] hover:bg-opacity-50">
                    Kelas Premium, Mulai berlangganan !
                  </button>
                }
                modal
              >
                <ModalPembayaran
                  data={chapters}
                  onHistoryTransaksi={onHistoryTransaksi}
                  setInsopen={setInsopen}
                ></ModalPembayaran>

              </Popup>
            </div>
          ) : (
            <button
              onClick={onCreateCourse}
              className="w-full rounded text-xs lg:text-sm py-3 bg-[#0092A4] text-white font-semibold flex justify-center items-center hover:bg-[#0092A4] hover:bg-opacity-50"
            >
              Kelas ini gratis, ayo lanjut berlajar !
            </button>
          )
        ) : (
          ""
        )}
        <div className="bg-white rounded-lg shadow-2xl lg:shadow-lg flex flex-col px-2 py-4 h-[75vh] overflow-auto">
          <div className="grid grid-cols-2 md:gap-x-2">
            <h1 className="ml-2 text-sm font-semibold md:text-base">
              {chapters.courseStatus === "inProgress" ||
                chapters.courseStatus === "Selesai" ? "Materi Belajar" : ""}

            </h1>

            <div className="">
              {chapters.courseStatus !== "Selesai" &&
                chapters.courseStatus === "inProgress" && (
                  <ProgressBar contentStatus={contentStatus} />
                )}
            </div>
          </div>

          {chapters.courseStatus === "inProgress" ||
            chapters.courseStatus === "Selesai"
            ? chapter.map((item, i) => (
              <div key={i} className="mx-2 my-1">
                <div className="flex justify-between mt-3 text-xs font-semibold lg:text-sm">
                  <h1 className="font-bold text-color-primary">
                    Chapter {i + 1} - {item.chapterTitle}
                  </h1>
                  {/* <p className="mr-2 text-blue-400">60 Menit</p> */}
                </div>
                {/* loop untuk mengambil list data dari setiap chapter */}
                {/* #6148FF */}
                {item.contents.map((content, x) => (
                  <div
                    key={x}
                    className={cn(
                      "duration-300 cursor-pointer",
                      isActive.title === i &&
                      isActive.chapter === x &&
                      "scale-105 bg-primary text-white"
                    )}
                    onClick={() => {
                      console.log(content, "");
                      setIsActive({ title: i, chapter: x });
                      handleVideoLink(content.contentUrl);
                      setIsloading((a) => !a);
                      // setClickedContentIndex(x);
                    }}
                  >
                    <ChapterItem
                      contentData={content}
                      index={x}
                      isActive={
                        isActive.title === i && isActive.chapter === x
                      }
                      onVideoClick={onVideoClick}
                    // handleContentStatus={() => handleContentStatus()}
                    />
                  </div>
                ))}
              </div>
            ))
            : (
              <div className="relative">
                {/* Content List */}
                {chapter.map((item, i) => (
                  <div key={i} className="mx-2 my-1 opacity-50">
                    {/* Konten Setiap Chapter */}
                    <div className="flex justify-between mt-3 text-xs font-semibold lg:text-sm">
                      <h1 className="font-bold text-color-primary">
                        Chapter {i + 1} - {item.chapterTitle}
                      </h1>
                    </div>
                    {item.contents.map((content, x) => (
                      <div
                        key={x}
                        className={cn(
                          "duration-300",
                          isActive.title === i &&
                          isActive.chapter === x &&
                          "scale-105 bg-primary text-white"
                        )}
                      >
                        <ChapterItem
                          contentData={content}
                          index={x}
                          isActive={isActive.title === i && isActive.chapter === x}
                          onVideoClick={onVideoClick}
                        />
                      </div>
                    ))}
                  </div>
                ))}

                {/* Content Overlay di Tengah Chapter Map */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  {/* <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-center">
                    {chapters.courseType !== "Free"
                      ? "Harus berlangganan untuk mengakses konten ini"
                      : ""}
                  </div> */}
                </div>
              </div>
            )
          }
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        direction="left"
        className="overflow-auto max-w-[600px] !w-full"
        lockBackgroundScroll
        enableOverlay={true}
      >
        <div className="flex justify-between">
          <h1 className="bg-[#0092A4] flex-1 p-4 sticky top-0 shadow z-50 font-bold text-white">
            Riwayat Pembayaran
          </h1>
          <button onClick={onCloseDrawer} className="p-4 bg-red-500 text-white">
            CLOSE
          </button>
        </div>
        {DataHistoryTransaksi && (
          <HistoryPembayaran data={DataHistoryTransaksi}></HistoryPembayaran>
        )}
      </Drawer>
    </>
  );
};

const ModalPembayaran = ({ data, onHistoryTransaksi, setInsopen }) => {
  const geID = useParams();

  const onPembayaran = async () => {
    try {
      const data = await getPembayaran({ courseId: geID.courseId });

      console.log(data);

      Swal.fire({
        title: "Berhasil!",
        text: "Pembayaran berhasil diproses.",
        icon: "success",
        confirmButtonText: "OK",
        didClose: () => {
          window.location.href = data.createdTransactionData.linkPayment;
        },
      });
    } catch (error) {
      setInsopen(true);
      Swal.fire({
        title: "Gagal!",
        text:
          error.response.data.message ||
          "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.",
        icon: "error",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        didClose: () => {
          onHistoryTransaksi();
        },
      });

      console.log(error.response.data.message);
    }
  };

  const coursePecentageTotal = () => {
    let ppnTotal = data.coursePrice * (11 / 100);
    return {
      ppn: ppnTotal,
      total: data.coursePrice + ppnTotal,
    };
  };

  return (
    <div className="p-2 w-full max-w-lg mx-auto h-full space-y-4 rounded-lg">
      <div className="shadow bg-white relative">
        <div className="overflow-hidden rounded-t-lg">
          <img className="object-cover w-full h-48 md:h-64" src={data.image} alt={data.courseName} />
        </div>
        <div className="p-4 absolute bottom-0 bg-white w-full border-t border-t-slate-300 rounded-b-lg">
          <div className="text-sm md:text-base font-bold text-[#0092A4]">
            {data.courseName}
          </div>
          <div className="text-xs md:text-sm font-bold">{data.intendedFor}</div>
          <div className="text-xs md:text-sm">by {data.courseBy}</div>
        </div>
      </div>
      <div className="border-b py-2">
        <span className="font-bold mt-10 text-sm md:text-base">Ringkasan Pembayaran</span>
        <div className="flex justify-between text-sm md:text-base">
          <span>Harga</span>
          <span className="font-bold">{convertToRupiah(data.coursePrice)}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span>PPN 11%</span>
          <span className="font-bold">
            {convertToRupiah(coursePecentageTotal().ppn)}
          </span>
        </div>
      </div>
      <div className="flex justify-between py-2 text-sm md:text-base">
        <span>Total Harga</span>
        <span className="font-bold">
          {convertToRupiah(coursePecentageTotal().total)}
        </span>
      </div>
      <button
        onClick={onPembayaran}
        className="p-3 text-center bg-[#0092A4] text-white font-bold rounded cursor-pointer w-full hover:bg-opacity-90"
      >
        BAYAR
      </button>
    </div>
  );

};

const HistoryPembayaran = ({ data }) => {
  const items = data?.userTransactions;
  if (items.length === 0) {
    return <div className="p-2 text-center">Data history tidak ditemukan</div>;
  }
  return items.map((a, k) => {
    const isUnpaid = a.paymentStatus === "unpaid";
    return (
      <div key={k} className="p-5 bg-white rounded-lg m-5 shadow">
        <div className="flex justify-between items-center">
          {/* <div>
            <div className="text-sm font-bold text-[#0092A4]">
              {a.course.courseName}
            </div>
            <div className="text-xs">{a.course.intendedFor}</div>
          </div> */}
        </div>
        <div className="overflow-hidden rounded-lg">
          <img
            className="object-cover w-full h-[150px] rounded-lg"
            src={a.course.image}
            alt="course"
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-[#0092A4] mt-4">
              {a.course.courseName}
            </div>
            <div className="text-xs font-semibold">{a.course.intendedFor}</div>
          </div>
        </div>
        <div className="flex justify-between border-t-slate-300 mt-2 mb-2">
          <p className="flex items-center text-xs font-semibold text-color-primary -tracking-widest md:-tracking-wider">
            <span className="text-green-500 mr-[2.5px]">
              <PiShieldStarBold size={24} />
            </span>{" "}
            {a.course.courseLevel}
          </p>
          <p className="flex items-center text-xs font-semibold text-color-primary -tracking-widest md:-tracking-wider ">
            <span className="text-[#F9CC00] mr-[2.5px]">
              <FaStar />
            </span>{" "}
            {a.course.rating}
          </p>
        </div>
        {/* <span className="font-bold">Ringkasan Pembayaran</span> */}
        <div className="py-1">
          {/* <div className="flex justify-between">
            <span>Harga</span>
            <span className="font-bold">{convertToRupiah(a.price)}</span>
          </div>
          <div className="flex justify-between">
            <span>PPN 11%</span>
            <span className="font-bold">{convertToRupiah(a.ppn)}</span>
          </div> */}
        </div>
        <div className="flex justify-between">
          {/* <span>Total Harga</span> */}
          {/* <span className="font-bold">{convertToRupiah(a.totalPrice)}</span> */}
        </div>
        <div className="flex justify-between border-t-slate-300">
          <a href={isUnpaid ? a.linkPayment : "#"}>
            <button
              className={`p-2.5 text-center rounded-full cursor-pointer ${isUnpaid ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
            >
              {isUnpaid ? "Belum Bayar" : "Sudah Bayar"}
            </button>
          </a>
          <a className="font-bold text-[#0092A4]">
            {convertToRupiah(a.totalPrice)}
          </a>
        </div>
      </div>
    );
  });
};

ProgressCourse.propTypes = {
  isOpen: PropTypes.bool,
  chapters: PropTypes.object,
  handleVideoLink: PropTypes.func,
};

export default ProgressCourse;
