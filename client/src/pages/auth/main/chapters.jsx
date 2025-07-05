import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AddChapterDialog from '@/components/main/add-chapter'
import { deleteChapter, editChapter, fetchChaptersBySubject } from '../../../../store/chapter-slice'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import Swal from 'sweetalert2'
import dashboardImage from "../../../assets/addChap.png"
import { toast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

function ChapterPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  const { chapterList } = useSelector((state) => state.chapters);

  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentChapterName, setCurrentChapterName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (id) => {
    navigate(`/dashboard/notes/${id}`);
  };

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    dispatch(deleteChapter(id)).unwrap().then((data) => {
      if (data?.success) {
        dispatch(fetchChaptersBySubject(subjectId)).unwrap();
        toast({
          title: "Chapter deleted successfully",
          className: "bg-black text-white",
        });
      }
    });
  }

  const handleCheckboxChange = async (id, currentName, currentStatus) => {
    try {
      const result = await dispatch(editChapter({
        id,
        chapter_name: currentName,
        isCompleted: !currentStatus,
      })).unwrap();

      if (result?.success) {
        dispatch(fetchChaptersBySubject(subjectId));
        toast({
          title: "Chapter status updated",
          className: "bg-black text-white",
        });
      }
    } catch (err) {
      toast({
        title: err,
        className: "bg-red-600 text-white",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchChaptersBySubject(subjectId)).unwrap();
      } catch (error) {
        console.error("Failed to fetch chapters", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, subjectId]);

  const filteredChapters = chapterList.filter(chapter =>
    chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat pt-20 bg-orange-100"
      style={{ backgroundImage: `url('/assets/bg.png')` }}
      >

      {loading ? null : chapterList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <img src={dashboardImage} alt="No subjects" className="w-[200px] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Chapters Yet</h2>
          <p className="text-gray-500 mb-4">Start by adding your first chapter to organize your notes.</p>
          <AddChapterDialog
            open={open}
            setOpen={setOpen}
            currentEditId={currentEditId}
            setCurrentEditId={setCurrentEditId}
            currentChapterName={currentChapterName}
            setCurrentChapterName={setCurrentChapterName}
            subjectId={subjectId}
          />
        </div>
      ) : (
<div className="px-4 mb-6">
  {/* Add Chapter Button */}
  <div className="flex justify-end mb-4">
    <AddChapterDialog
      open={open}
      setOpen={setOpen}
      currentEditId={currentEditId}
      setCurrentEditId={setCurrentEditId}
      currentChapterName={currentChapterName}
      setCurrentChapterName={setCurrentChapterName}
      subjectId={subjectId}
    />
  </div>

  {/* Search Bar */}
<div className="flex justify-center mb-6">
  <input
    type="text"
    placeholder="Search chapter..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-[80%] px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
  />
</div>

</div>

      )}

      {!loading && filteredChapters.length > 0 && filteredChapters.map((chapter) => (
        <div
          key={chapter._id}
          className="w-[80%] h-[71px] md:h-[100px] m-auto mt-10 flex justify-center relative group px-4 cursor-pointer"
          onClick={() => handleView(chapter._id)}
          style={{
            border: "10px solid rgb(62, 45, 26)",
            borderTop: "5px solid rgb(62, 45, 26)",
            borderLeft: "3px solid rgb(62, 45, 26)",
            backgroundColor: "rgba(198, 162, 122, 0.521)",
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={chapter.isCompleted}
              onClick={(e) => e.stopPropagation()}
              onChange={() =>
                handleCheckboxChange(chapter._id, chapter.chapter_name, chapter.isCompleted)
              }
              className="w-5 h-5 cursor-pointer accent-black border-2 border-[rgb(62,45,26)] rounded-md"
            />

            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-md overflow-hidden text-ellipsis whitespace-nowrap max-w-[80%]">
              {chapter.chapter_name}
            </h1>
          </div>

          <div className="flex items-center justify-end gap-2 ml-auto mt-2 sm:mt-0" onClick={(e) => e.stopPropagation()}>
            <div className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="text-orange-950"
                style={{ backgroundColor: "rgb(248, 231, 212)" }}
                onClick={() => {
                  setCurrentEditId(chapter._id);
                  setOpen(true);
                  setCurrentChapterName(chapter.chapter_name);
                }}
              >
                <Pencil size={20} className="mr-2" />
                Edit
              </Button>
              <Button
                className="text-orange-950"
                style={{ backgroundColor: "rgb(248, 231, 212)" }}
                onClick={() => handleDelete(chapter._id)}
              >
                <Trash2 size={20} className="mr-2" />
                Delete
              </Button>
            </div>

            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="text-white cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-orange-100 rounded shadow-md p-2 space-y-2">
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentEditId(chapter._id);
                      setOpen(true);
                      setCurrentChapterName(chapter.chapter_name);
                    }}
                    className="cursor-pointer text-black hover:bg-orange-300"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(chapter._id)}
                    className="cursor-pointer text-red-600 hover:bg-orange-300"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}

      {!loading && filteredChapters.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No chapters match your search.</p>
      )}
    </div>
  );
}

export default ChapterPage;
