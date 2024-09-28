/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Main from "../../components/MyCourseComponent/Main";
import SideFilter from "../../components/MyCourseComponent/SideFilter";
import Navbar from "../../components/NavbarComponent/Navbar";
import { getCourseUser, getCategory } from "../../api/fetching";
import CircularProgress from '@mui/material/CircularProgress';

const MyCoursePage = () => {
  const data = ["All", "In Progress", "Done"];
  const { userId } = useParams();
  const navigate = useNavigate(); // Untuk navigasi
  const [userCourses, setUserCourses] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState([]);
  const [valueChecked, setValueChecked] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Tambahkan state untuk input pencarian
  const [selectedCategories, setSelectedCategories] = useState([]); // Untuk filter kategori
  const [selectLevel, setSelectLevel] = useState(""); // Untuk filter level
  const [loading, setLoading] = useState(false); // Untuk loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resGetUserCourse = await getCourseUser({ userId, searchTerm, selectedCategories, selectLevel });
        const resGetCategory = await getCategory();
        setUserCourses(resGetUserCourse);
        setCategory(resGetCategory);
        setCategories(resGetCategory.Category);
        setLevel(resGetUserCourse.Level);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, searchTerm, selectedCategories, selectLevel]);

  const handleCheckboxChange = (e) => {
    setValueChecked(e.target.checked ? e.target.value : "");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchTerm(e.target.value);
    }
  };

  const handleSelectLevel = (e) => {
    setSelectLevel(e.target.value);
  };

  const handleCategorySelect = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== value));
    }
  };

  const handleStartCourse = (courseId) => {
    // Navigasi ke halaman detail kursus
    navigate(`/course/${courseId}`);
  };

  return (
    <>
      <Navbar />
      <div className="w-full pt-24 bg-layer lg:pt-28">
        <div className="w-10/12 mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-bold md:text-xl lg:text-2xl">
              Kelas Berjalan
            </h1>
            {/* <div className="lg:w-3/12">
              <form className="relative w-full" onKeyDown={handleSearchSubmit}>
                <input
                  type="text"
                  className="w-full h-8 pl-6 font-semibold text-black transition-all outline-none rounded-3xl ring-2 ring-color-primary lg:h-11 focus:outline-1"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="text-slate-500 absolute -left-3 lg:left-0 top-2 lg:top-[10px] mx-5 font-semibold px-2 transition duration-200 input-text text-xs md:text-sm lg:text-base">
                  Cari kelas...
                </span>
                <span className="absolute right-2 md:right-5 top-[2.5px] inline-block bg-[#0092A8] p-2 rounded-xl">
                  <Search className="w-3 h-3 text-white lg:w-5 lg:h-5" />
                </span>
              </form>
            </div> */}
          </div>
          <div className="mt-6 lg:mt-8">
            <div className="grid grid-cols-3 gap-x-4 lg:gap-x-20">
              <div className="col-span-3 md:col-span-1">
                <SideFilter
                  categorys={category}
                  levels={level}
                  handleCheckboxChange={handleCheckboxChange}
                  handleSelectLevel={handleSelectLevel}
                  handleCategorySelect={handleCategorySelect}
                />
              </div>
              <div className="col-span-3 md:col-span-2">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress />
                    <p className="ml-4 text-xl text-gray-500">Loading...</p>
                  </div>
                ) : userCourses.length > 0 ? (
                  <Main
                    courses={userCourses}
                    data={data}
                    valueChecked={valueChecked}
                    id={userId}
                    onStartCourse={handleStartCourse} // Prop tambahan untuk menangani navigasi dari tombol "Mulai"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Tidak ada kursus yang ditemukan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCoursePage;
