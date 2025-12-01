import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, Video, FileText, ChevronLeft, Layout, UploadCloud } from 'lucide-react';
import { useCreator } from '../context/ContextProvider';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { createCourse, updateCourse, fetchCourse, uploadFile, loading } = useCreator();

  const isEditMode = !!courseId;

  const [activeTab, setActiveTab] = useState('details');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Development',
    thumbnail: null
  });

  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction', lessons: [] }
  ]);

  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadingLessons, setUploadingLessons] = useState({}); // { lessonId: true }
  const [localError, setLocalError] = useState(null);

  // Fetch course data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadCourse = async () => {
        const data = await fetchCourse(courseId);
        if (data) {
          setCourseData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            category: data.category || 'Development',
            thumbnail: data.thumbnail || null
          });
          if (data.modules && data.modules.length > 0) {
            setModules(data.modules);
          }
        } else {
          // Handle error or redirect
          navigate('/');
        }
      };
      loadCourse();
    }
  }, [isEditMode, courseId, fetchCourse, navigate]);

  // Helper to check if any uploads are in-progress
  const anyUploading = isUploadingThumbnail || Object.values(uploadingLessons).some(Boolean);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Show immediate preview
      const previewUrl = URL.createObjectURL(file);
      setCourseData(prev => ({ ...prev, thumbnail: previewUrl }));

      // 2. Upload in background
      setIsUploadingThumbnail(true);
      setLocalError(null);
      try {
        const url = await uploadFile(file);
        // 3. Update with actual server URL
        setCourseData(prev => ({ ...prev, thumbnail: url }));
      } catch (err) {
        setLocalError(err.message || 'Failed to upload thumbnail.');
        // Revert to null if upload fails? Or keep local preview? 
        // Better to revert or show error.
        setCourseData(prev => ({ ...prev, thumbnail: null }));
      } finally {
        setIsUploadingThumbnail(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!courseData.title || !courseData.description || !courseData.price) {
      alert("Please fill in the course title, description, and price.");
      return;
    }
    // Prevent save while uploads are running
    if (anyUploading) {
      alert('Please wait for uploads to finish before publishing.');
      return;
    }

    let success = false;
    console.log('Saving Course:', { isEditMode, courseId, courseData, modules });
    if (isEditMode) {
      success = await updateCourse(courseId, courseData, modules);
    } else {
      success = await createCourse(courseData, modules);
    }

    if (success) {
      navigate('/');
    }
  };

  const addModule = () => {
    setModules([...modules, { id: Date.now(), title: 'New Module', lessons: [] }]);
  };

  const removeModule = (moduleId) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const removeLesson = (moduleIndex, lessonId) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(l => l.id !== lessonId);
    setModules(newModules);
  };

  // When the user selects a video for a module lesson we upload it immediately,
  // keep a placeholder lesson while uploading, then replace it with the uploaded URL.
  const handleLessonFileUpload = async (file, moduleIndex) => {
    const lessonId = Date.now();
    // Add placeholder lesson with uploading flag
    setModules(prev => {
      const newModules = [...prev];
      newModules[moduleIndex].lessons.push({
        id: lessonId,
        title: file.name,
        type: 'video',
        uploading: true
      });
      return newModules;
    });
    setUploadingLessons(prev => ({ ...prev, [lessonId]: true }));
    setLocalError(null);
    try {
      const videoUrl = await uploadFile(file);
      setModules(prev => {
        const newModules = [...prev];
        newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.map(l =>
          l.id === lessonId ? { ...l, url: videoUrl, uploading: false } : l
        );
        return newModules;
      });
    } catch (err) {
      setLocalError(err.message || 'Video upload failed.');
      // Remove the failed lesson placeholder
      setModules(prev => {
        const newModules = [...prev];
        newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(l => l.id !== lessonId);
        return newModules;
      });
    } finally {
      setUploadingLessons(prev => {
        const copy = { ...prev };
        delete copy[lessonId];
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-stone-800">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-stone-600 font-medium hover:text-stone-900" disabled={loading}>
                Save Draft
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : <><Save size={18} /> {isEditMode ? 'Update Course' : 'Publish Course'}</>}
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-8 mt-1">
            <button onClick={() => setActiveTab('details')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-amber-700 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>Course Details</button>
            <button onClick={() => setActiveTab('curriculum')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-amber-700 text-amber-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>Curriculum</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'details' && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Course Title</label>
              <input type="text" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="e.g. Complete Python Bootcamp 2024" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Price ($)</label>
                <input type="number" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="49.99" value={courseData.price} onChange={(e) => setCourseData({ ...courseData, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white" value={courseData.category} onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}>
                  <option>Development</option><option>Business</option><option>Design</option><option>Marketing</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
              <textarea rows="6" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="What will students learn in this course?" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Course Thumbnail</label>
              <label className="border-2 border-dashed border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 hover:border-amber-400 transition-colors cursor-pointer relative overflow-hidden">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {isUploadingThumbnail ? (
                  <div className="text-center">
                    <div className="w-full h-48 bg-stone-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                      <span className="text-sm text-amber-600 font-medium">Uploading thumbnail…</span>
                    </div>
                  </div>
                ) : courseData.thumbnail ? (
                  <div className="text-center">
                    <div className="w-full h-48 bg-stone-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                      {typeof courseData.thumbnail === 'string' ? <img src={courseData.thumbnail} alt="Preview" className="h-full object-cover" /> : <span className="text-amber-600 font-bold">{courseData.thumbnail.name}</span>}
                    </div>
                    <span className="text-sm text-green-600 font-medium flex items-center justify-center gap-1"><Layout size={16} /> File Selected</span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-3"><UploadCloud size={24} /></div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6 animate-fade-in-up">
            {modules.map((module, index) => (
              <div key={module.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center group">
                  <div className="flex items-center gap-3"><span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Module {index + 1}</span><input type="text" value={module.title} className="bg-transparent font-bold text-stone-800 focus:bg-white focus:ring-2 focus:ring-amber-500 rounded px-2 py-1 outline-none" onChange={(e) => { const newModules = [...modules]; newModules[index].title = e.target.value; setModules(newModules); }} /></div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50" onClick={() => removeModule(module.id)}><Trash2 size={18} /></button></div>
                </div>
                <div className="p-6 space-y-3">
                  {module.lessons.length === 0 ? <p className="text-sm text-stone-400 italic text-center py-4">No lessons in this module yet.</p> : module.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 border border-stone-100 rounded-lg bg-stone-50">
                      {lesson.type === 'video' ? <Video size={16} className="text-blue-500" /> : <FileText size={16} className="text-green-500" />}
                      <span className="text-sm font-medium text-stone-700">{lesson.title}</span>
                      <div className="ml-auto flex items-center gap-2">
                        {lesson.uploading || uploadingLessons[lesson.id] ? (
                          <span className="text-xs text-amber-700">Uploading…</span>
                        ) : lesson.url ? (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Video Attached</span>
                        ) : (
                          <span className="text-xs text-stone-400">Not uploaded</span>
                        )}
                        <button onClick={() => removeLesson(index, lesson.id)} className="p-1.5 rounded hover:bg-red-50 text-stone-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors border border-stone-200 hover:border-amber-200">
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => { if (e.target.files[0]) { handleLessonFileUpload(e.target.files[0], index); } }} />
                      <Plus size={16} /> Upload Video
                    </label>
                    <button onClick={() => { const newModules = [...modules]; newModules[index].lessons.push({ id: Date.now(), title: 'New Text Lesson', type: 'text' }); setModules(newModules); }} className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-amber-700 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors border border-stone-200 hover:border-amber-200"><Plus size={16} /> Add Text</button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addModule} className="w-full py-4 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 font-bold hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-all flex items-center justify-center gap-2"><Plus size={20} /> Add New Module</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;