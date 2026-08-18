import React, { useEffect, useState } from "react";
import { Menu, X, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url, className, light, playing, controls = true, muted }: any) => {
  if (!url) return null;
  const isDirectVideo = url.includes("cloudinary.com") || url.match(/\.(mp4|webm|ogg|mov)$/i);
  if (isDirectVideo) {
    return (
      <video 
        src={url} 
        controls={controls}
        autoPlay={playing}
        muted={muted}
        playsInline
        poster={typeof light === "string" ? light : undefined}
        className={`w-full h-full ${className || ""}`}
        style={{ backgroundColor: "black" }}
      />
    );
  }
  return (
    <ReactPlayer 
      url={url} 
      width="100%" 
      height="100%" 
      controls={controls}
      playing={playing}
      muted={muted}
      playsinline
      light={light}
      className={className} 
    />
  );
};


export function PublicPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ isOpen: boolean, type: "image" | "video", url: string, caption?: string }>({ isOpen: false, type: "image", url: "" });
  const [enquiryForm, setEnquiryForm] = useState({
    studentName: "",
    parentName: "",
    applyingClass: "",
    phone: "",
    email: "",
    message: ""
  });
  const [enquiryStatus, setEnquiryStatus] = useState("");

  useEffect(() => {
    fetch("/api/public-data")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryStatus("Submitting...");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryForm)
      });
      if (!res.ok) throw new Error("Failed to submit");
      setEnquiryStatus("Enquiry submitted successfully! We will contact you soon.");
      setEnquiryForm({ studentName: "", parentName: "", applyingClass: "", phone: "", email: "", message: "" });
    } catch (err) {
      setEnquiryStatus("Error submitting enquiry. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-emerald-800">Loading...</div>;
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center">Error loading data.</div>;

  const { schoolInformation: school, homepageContent: home, management, teachers, academics, facilities, achievements, events, notices, gallery, videos, admissionInformation: admissions } = data;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="bg-[#f8fafc] font-sans text-slate-800 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-3">
            {school.logoUrl ? (
              <img src={school.logoUrl || undefined} alt="Logo" className="w-12 h-12 object-contain" />
            ) : (
              <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                {school.name ? school.name.charAt(0) : "T"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-emerald-800 font-bold text-lg md:text-xl tracking-tight leading-tight uppercase line-clamp-1">
                {school.name || "Trivir Public School"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Universal Scrollable Nav (Kept on UI always) */}
        <nav className="flex items-center gap-6 px-4 md:px-8 pb-3 overflow-x-auto whitespace-nowrap hide-scrollbar border-t border-slate-50 pt-3">
          <button onClick={() => scrollTo("home")} className="text-sm font-semibold text-emerald-800 border-b-2 border-emerald-600 pb-1">Home</button>
          <button onClick={() => scrollTo("about")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">About</button>
          <button onClick={() => scrollTo("academics")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Academics</button>
          <button onClick={() => scrollTo("facilities")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Facilities</button>
          <button onClick={() => scrollTo("teachers")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Teachers</button>
          <button onClick={() => scrollTo("gallery")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Gallery</button>
          <button onClick={() => scrollTo("contact")} className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Contact</button>
          <button onClick={() => scrollTo("admissions")} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors ml-auto">Admissions</button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section id="home" className="relative min-h-[500px] bg-emerald-900 overflow-hidden flex items-center py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-emerald-900/40 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${home.heroImageUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1920"})` }}
          ></div>
          <div className="relative z-20 px-8 lg:px-16 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="max-w-2xl text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4 italic">
                {home.heroTitle || "Empowering Minds, Shaping Futures."}
              </h1>
              <p className="text-emerald-50 text-lg md:text-xl mb-8 leading-relaxed opacity-90">
                {home.heroSubtitle || "Providing a nurturing environment where excellence meets character."}
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollTo("admissions")} className="bg-white text-emerald-800 px-8 py-3 rounded-md font-bold shadow-lg hover:bg-emerald-50 transition-colors">Enquire Now</button>
                <button onClick={() => scrollTo("contact")} className="border-2 border-white/30 text-white px-8 py-3 rounded-md font-bold hover:bg-white/10 transition-colors">Contact Us</button>
              </div>
            </div>

            {/* Notices Widget */}
            {notices && notices.length > 0 && (
              <div className="bg-white p-6 rounded-t-xl md:rounded-xl shadow-2xl w-full md:w-80 md:self-end mt-12 md:mt-0 relative md:-bottom-12 z-30">
                <h3 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Latest Notices
                </h3>
                <ul className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                  {notices.slice(0, 5).map((notice: any) => (
                    <li key={notice.id} className="flex flex-col border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{notice.publishDate}</span>
                      <span className={`font-medium hover:text-emerald-600 cursor-pointer ${notice.isImportant ? "text-red-600" : ""}`}>{notice.title}</span>
                      {notice.content && <span className="text-xs text-slate-500 mt-1 line-clamp-2">{notice.content}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-[#f8fafc] px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-serif text-slate-800 italic mb-4">About Our School</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
            {school.affiliationInfo && (
              <div className="mb-6 inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                {school.affiliationInfo}
              </div>
            )}
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              {home.aboutText || school.introduction}
            </p>
          </div>
          
          { (school.principalMessage || school.principalPhotoUrl || school.principalName) && (
            <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-emerald-50 mb-16 relative">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {(school.principalPhotoUrl || school.principalName) && (
                  <div className="w-40 h-40 shrink-0 bg-emerald-50 rounded-full border-4 border-emerald-100 overflow-hidden">
                    {school.principalPhotoUrl ? (
                      <img src={school.principalPhotoUrl} alt={school.principalName || "Principal"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800 text-2xl font-serif italic">
                        {school.principalName ? school.principalName.charAt(0) : "P"}
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-serif text-emerald-900 mb-2">Message from the Principal</h3>
                  {school.principalName && <p className="text-emerald-600 font-bold mb-4">{school.principalName}</p>}
                  <p className="text-slate-600 italic leading-relaxed">"{school.principalMessage}"</p>
                </div>
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {school.mission && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 text-center">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Our Mission</h3>
                <p className="text-slate-600">{school.mission}</p>
              </div>
            )}
            {school.vision && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 text-center">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Our Vision</h3>
                <p className="text-slate-600">{school.vision}</p>
              </div>
            )}
            {school.coreValues && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-50 text-center">
                <h3 className="text-xl font-bold text-emerald-900 mb-3">Core Values</h3>
                <p className="text-slate-600">{school.coreValues}</p>
              </div>
            )}
          </div>
        </section>

        {/* Management Section */}
        <section className="bg-white px-4 md:px-8 py-16 md:py-24 border-y border-emerald-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Our Visionary Management</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
          </div>
          {management && management.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
              {management.map((mgr: any) => (
                <div key={mgr.id} className="bg-[#f0fdf4] p-8 rounded-2xl border border-emerald-100 flex flex-col items-center text-center group transition-all hover:shadow-lg">
                  <div className="w-32 h-32 bg-emerald-200 rounded-full mb-6 border-4 border-white shadow-sm overflow-hidden shrink-0">
                    {mgr.photoUrl ? (
                      <img src={mgr.photoUrl || undefined} alt={mgr.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mgr.name}`} alt={mgr.name} />
                    )}
                  </div>
                  <h4 className="font-bold text-emerald-900 text-xl">{mgr.name}</h4>
                  <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-4">{mgr.designation || mgr.role}</p>
                  {mgr.message && (
                    <p className="text-slate-600 text-sm italic leading-relaxed">"{mgr.message}"</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 italic">Management information coming soon.</div>
          )}
        </section>

        {/* Academics */}
        <section id="academics" className="bg-[#f8fafc] px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Academics</h2>
              <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
            </div>
            {academics && (academics.approach || academics.classes) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {academics.approach && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-50 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg text-emerald-900 mb-2">Academic Approach</h3>
                    <p className="text-slate-600">{academics.approach}</p>
                  </div>
                )}
                {academics.classes && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-50 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg text-emerald-900 mb-2">Classes & Levels</h3>
                    <p className="text-slate-600">{academics.classes}</p>
                  </div>
                )}
                {academics.methodology && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-50 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg text-emerald-900 mb-2">Teaching Methodology</h3>
                    <p className="text-slate-600">{academics.methodology}</p>
                  </div>
                )}
                {academics.curriculum && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-50 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg text-emerald-900 mb-2">Curriculum</h3>
                    <p className="text-slate-600">{academics.curriculum}</p>
                  </div>
                )}
                {academics.examination && (
                  <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-emerald-50 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-lg text-emerald-900 mb-2">Examination System</h3>
                    <p className="text-slate-600">{academics.examination}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500 italic">Academic information coming soon.</div>
            )}
          </div>
        </section>

        {/* Facilities */}
        <section id="facilities" className="bg-white px-4 md:px-8 py-16 md:py-24 border-t border-emerald-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-slate-800 italic mb-4">World-Class Facilities</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
          </div>
          {facilities && facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {facilities.map((facility: any) => (
                <div key={facility.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all border border-emerald-50 group">
                  {facility.iconOrImageUrl && (
                    <div className="h-56 bg-emerald-50/50 overflow-hidden relative cursor-pointer" onClick={() => setLightbox({ isOpen: true, type: "image", url: facility.iconOrImageUrl, caption: facility.title })}>
                      <img src={facility.iconOrImageUrl || undefined} alt={facility.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                  <div className="p-8 text-center">
                    <h4 className="text-xl font-bold text-emerald-900 mb-3">{facility.title}</h4>
                    {facility.description && <p className="text-slate-600 leading-relaxed">{facility.description}</p>}
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className="text-center text-slate-500 italic">Facilities coming soon.</div>
          )}
        </section>

        {/* Teachers */}
        <section id="teachers" className="bg-emerald-950 px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white italic mb-4">Our Dedicated Faculty</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
          </div>
          {teachers && teachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {teachers.map((teacher: any) => (
                <div key={teacher.id} className="bg-emerald-900 rounded-xl overflow-hidden shadow-lg border border-emerald-800">
                  <div className="h-48 bg-emerald-800 relative">
                    {teacher.photoUrl ? (
                      <img src={teacher.photoUrl || undefined} alt={teacher.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600">No Photo</div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h4 className="font-bold text-white text-lg mb-1">{teacher.name}</h4>
                    <p className="text-emerald-400 text-sm font-medium mb-1">{teacher.designation}</p>
                    {teacher.subject && <p className="text-emerald-100 text-xs mb-3">{teacher.subject}</p>}
                    {teacher.bio && <p className="text-emerald-200 text-xs line-clamp-3">{teacher.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-emerald-200/50 italic">Faculty members coming soon.</div>
          )}
        </section>

        {/* Achievements & Events (Combined layout) */}
        <section className="bg-[#f8fafc] px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            
            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <div>
                <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Achievements</h2>
                <div className="w-16 h-1 bg-emerald-500 mt-2 mb-8 rounded-full"></div>
                <div className="space-y-6">
                  {achievements.slice(0, 4).map((ach: any) => (
                    <div key={ach.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                      {ach.imageUrl && (
                        <img src={ach.imageUrl || undefined} alt={ach.title} className="w-24 h-24 object-cover rounded-lg shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-emerald-900">{ach.title}</h4>
                        {ach.dateOrYear && <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider block mb-2">{ach.dateOrYear}</span>}
                        {ach.description && <p className="text-sm text-slate-600 line-clamp-3">{ach.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events */}
            {events && events.length > 0 && (
              <div>
                <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Upcoming Events</h2>
                <div className="w-16 h-1 bg-emerald-500 mt-2 mb-8 rounded-full"></div>
                <div className="space-y-6">
                  {events.slice(0, 4).map((event: any) => (
                    <div key={event.id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                      <div className="w-20 h-20 bg-[#f0fdf4] rounded-lg shrink-0 flex flex-col items-center justify-center border border-emerald-100">
                        {event.eventDate ? (
                          <>
                            <span className="text-2xl font-bold text-emerald-700">{event.eventDate.split(" ")[0]}</span>
                            <span className="text-xs font-semibold text-emerald-600 uppercase">{event.eventDate.split(" ")[1] || ""}</span>
                          </>
                        ) : (
                          <span className="text-emerald-700 font-bold text-sm">Event</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">{event.title}</h4>
                        {event.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{event.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="bg-white px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Gallery</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
          </div>
          {gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {gallery.map((img: any) => (
                <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-100 shadow-lg cursor-pointer" onClick={() => setLightbox({ isOpen: true, type: img.isVideo ? "video" : "image", url: img.imageUrl, caption: img.caption })}>
                  {img.isVideo ? (
                    <div className="w-full h-full pointer-events-none">
                      <VideoPlayer 
                        url={img.imageUrl || ""}
                        width="100%"
                        height="100%"
                        controls={false}
                        light={false}
                        className="react-player"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white/90">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={img.imageUrl || undefined} alt={img.caption || "Gallery item"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  )}
                  {img.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end pointer-events-none">
                      <p className="text-white p-4 text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 italic">Gallery coming soon.</div>
          )}
        </section>

        {/* Videos */}
        {videos && videos.length > 0 && (
          <section className="bg-[#f8fafc] px-4 md:px-8 py-16 md:py-24 border-t border-emerald-50">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-slate-800 italic mb-4">School Videos</h2>
              <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {videos.map((vid: any) => (
                <div key={vid.id} className="bg-white p-2 md:p-6 rounded-3xl shadow-lg border border-emerald-50 w-full cursor-pointer group" onClick={() => setLightbox({ isOpen: true, type: "video", url: vid.videoUrl, caption: vid.title })}>
                  <div className="aspect-video bg-black rounded-2xl mb-6 overflow-hidden relative w-full pointer-events-none">
                    <VideoPlayer 
                      url={vid.videoUrl || ""}
                      width="100%"
                      height="100%"
                      controls={false}
                      light={vid.thumbnailUrl || false}
                      className="absolute top-0 left-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                      <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform">
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-900 text-center">{vid.title}</h4>
                  {vid.description && <p className="text-sm text-slate-600 mt-2 text-center">{vid.description}</p>}
                </div>
              ))}

            </div>
          </section>
        )}

        {/* Admissions & Enquiry */}
        <section id="admissions" className="bg-emerald-900 px-4 md:px-8 py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center opacity-10"></div>
          <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-serif italic mb-6">Admissions Open</h2>
              <div className="w-16 h-1 bg-emerald-500 mt-2 mb-8 rounded-full"></div>
              
              {admissions && (
                <div className="space-y-6 text-emerald-50 opacity-90 text-lg">
                  {admissions.process && (
                    <div>
                      <h4 className="font-bold text-white mb-2">Admission Process</h4>
                      <p>{admissions.process}</p>
                    </div>
                  )}
                  {admissions.documentsRequired && (
                    <div>
                      <h4 className="font-bold text-white mb-2">Documents Required</h4>
                      <p>{admissions.documentsRequired}</p>
                    </div>
                  )}
                  {admissions.instructions && (
                    <div className="bg-emerald-800/50 p-4 rounded-lg border border-emerald-700/50">
                      <p>{admissions.instructions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 text-center">Admission Enquiry</h3>
              <form onSubmit={submitEnquiry} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student Name *</label>
                    <input required type="text" value={enquiryForm.studentName} onChange={e => setEnquiryForm({...enquiryForm, studentName: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Parent/Guardian Name *</label>
                    <input required type="text" value={enquiryForm.parentName} onChange={e => setEnquiryForm({...enquiryForm, parentName: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Applying for Class *</label>
                    <input required type="text" value={enquiryForm.applyingClass} onChange={e => setEnquiryForm({...enquiryForm, applyingClass: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input required type="tel" maxLength={10} minLength={10} pattern="[0-9]{10}" title="Please enter exactly 10 digits" value={enquiryForm.phone} onChange={e => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); setEnquiryForm({...enquiryForm, phone: val}); }} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" value={enquiryForm.email} onChange={e => setEnquiryForm({...enquiryForm, email: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message / Query</label>
                    <textarea rows={3} value={enquiryForm.message} onChange={e => setEnquiryForm({...enquiryForm, message: e.target.value})} className="w-full border border-slate-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                {enquiryStatus && (
                  <div className={`p-3 rounded-md text-sm ${enquiryStatus.includes("success") ? "bg-[#f0fdf4] text-emerald-700 border border-emerald-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                    {enquiryStatus}
                  </div>
                )}
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-md hover:bg-emerald-700 transition-colors shadow-md">
                  Submit Enquiry
                </button>
              </form>
            </div>
            
          </div>
        </section>

        {/* Contact Info */}
        <section id="contact" className="bg-white px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif text-slate-800 italic mb-4">Get in Touch</h2>
              <div className="w-16 h-1 bg-emerald-500 mt-2 mb-8 rounded-full"></div>
              
              <div className="space-y-6">
                {school.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0fdf4] text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Address</h4>
                      <p className="text-slate-600 leading-relaxed">{school.address}</p>
                    </div>
                  </div>
                )}
                {school.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0fdf4] text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Phone</h4>
                      <p className="text-slate-600">{school.phone}</p>
                    </div>
                  </div>
                )}
                {school.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0fdf4] text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Email</h4>
                      <p className="text-slate-600">{school.email}</p>
                    </div>
                  </div>
                )}
                {school.timings && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f0fdf4] text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">School Timings</h4>
                      <p className="text-slate-600">{school.timings}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {school.mapLocation ? (
              school.mapLocation.includes("<iframe") ? (
                <div className="h-[400px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: school.mapLocation }} />
              ) : school.mapLocation.includes("google.com/maps/embed") ? (
                <div className="h-[400px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                  <iframe src={school.mapLocation} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              ) : (
                <div className="h-[400px] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex flex-col items-center justify-center p-8 text-center gap-4">
                  <MapPin className="w-16 h-16 text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-800">View Our Location</h3>
                  <p className="text-slate-500 max-w-md">Click the button below to open our campus location directly in Google Maps.</p>
                  <a href={school.mapLocation} target="_blank" rel="noreferrer" className="mt-4 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Open Google Maps</a>
                </div>
              )
            ) : (

              <div className="h-[400px] bg-[#f8fafc] rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Map location not provided</p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100/60 pt-16 pb-8 px-4 md:px-8 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 mb-12 border-b border-emerald-900/50 pb-12">
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              {school.logoUrl ? (
                <img src={school.logoUrl || undefined} alt="Logo" className="w-10 h-10 object-contain grayscale brightness-200" />
              ) : (
                <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center text-white font-bold">
                  {school.name ? school.name.charAt(0) : "T"}
                </div>
              )}
              <span className="text-white font-bold text-xl uppercase tracking-widest">{school.name || "Trivir"}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              {school.introduction ? school.introduction.substring(0, 150) + "..." : "Providing a nurturing environment where excellence meets character."}
            </p>
            <div className="flex gap-4">
              {school.facebookUrl && <a href={school.facebookUrl} target="_blank" rel="noreferrer" className="transition-all transform hover:scale-110 shadow-sm rounded-full"><svg viewBox="0 0 24 24" className="w-12 h-12"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/><path fill="#FFFFFF" d="M16.671 15.542l.532-3.469h-3.328V9.823c0-.949.465-1.874 1.956-1.874h1.514V5.004s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.635H7.078v3.469h3.047v8.385a12.09 12.09 0 0 0 3.75 0v-8.385h2.796z"/></svg></a>}
              {school.twitterUrl && <a href={school.twitterUrl} target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#1DA1F2] rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-sm"><Twitter className="w-6 h-6 text-white" fill="currentColor" /></a>}
              {school.instagramUrl && <a href={school.instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-sm" style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}><Instagram className="w-6 h-6 text-white" /></a>}
              {school.youtubeUrl && <a href={school.youtubeUrl} target="_blank" rel="noreferrer" className="transition-all transform hover:scale-110 shadow-sm rounded-full"><svg viewBox="0 0 24 24" className="w-12 h-12"><path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>}


            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => scrollTo("home")} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => scrollTo("about")} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => scrollTo("academics")} className="hover:text-white transition-colors">Academics</button></li>
              <li><button onClick={() => scrollTo("facilities")} className="hover:text-white transition-colors">Facilities</button></li>
              <li><button onClick={() => scrollTo("gallery")} className="hover:text-white transition-colors">Gallery</button></li>
              <li><button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              {school.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />
                  <span>{school.address}</span>
                </li>
              )}
              {school.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span>{school.phone}</span>
                </li>
              )}
              {school.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-emerald-500" />
                  <span className="text-emerald-400 font-medium">{school.email}</span>
                </li>
              )}
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>&copy; {new Date().getFullYear()} {school.name || "Trivir Public School"}. All rights reserved.</div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </footer>
      {/* Lightbox Overlay */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8" onClick={() => setLightbox({ ...lightbox, isOpen: false })}>
          <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, isOpen: false }); }}>
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-7xl max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {lightbox.type === "video" ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <VideoPlayer url={lightbox.url} width="100%" height="100%" controls playing />
              </div>
            ) : (
              <img src={lightbox.url} alt={lightbox.caption || "Fullscreen view"} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            )}
            {lightbox.caption && <p className="text-white text-lg mt-6 font-medium text-center">{lightbox.caption}</p>}
          </div>
        </div>
      )}

    </div>
  );
}
