{/* selfies */}
<section className="grid md:grid-cols-2 gap-4">
  {/* FRONT */}
  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
    <h2 className="text-sm font-semibold mb-2">Selfie — Front</h2>
    <p className="text-xs text-white/60 mb-3">
      Hold phone at eye level. Face inside the circle.
    </p>
    <label className="inline-block text-xs bg-lime-400 text-black px-3 py-1 rounded-lg cursor-pointer">
      Upload / take photo
      <input
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          const url = URL.createObjectURL(file);
          setSelfieFront(file);
          setSelfieFrontUrl(url);
        }}
      />
    </label>

    {/* preview */}
    {selfieFrontUrl ? (
      <div className="relative mt-3 w-40 h-40 mx-auto">
        {/* image */}
        <img
          src={selfieFrontUrl}
          alt="front selfie"
          className="w-40 h-40 object-cover rounded-2xl"
        />
        {/* overlay circle to show face area */}
        <div className="absolute inset-2 rounded-full border-2 border-lime-300/80 pointer-events-none" />
        {/* overlay guide */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-lime-200">
          Face centered — good
        </div>
      </div>
    ) : (
      <div className="mt-3 w-40 h-40 mx-auto rounded-2xl bg-black/30 border border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/40">
        no selfie yet
      </div>
    )}
  </div>

  {/* SIDE */}
  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
    <h2 className="text-sm font-semibold mb-2">Selfie — Side (45°)</h2>
    <p className="text-xs text-white/60 mb-3">
      Turn your head slightly. We compare forehead, nose, jaw.
    </p>
    <label className="inline-block text-xs bg-lime-400 text-black px-3 py-1 rounded-lg cursor-pointer">
      Upload / take photo
      <input
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return;
          const url = URL.createObjectURL(file);
          setSelfieSide(file);
          setSelfieSideUrl(url);
        }}
      />
    </label>

    {selfieSideUrl ? (
      <div className="relative mt-3 w-40 h-40 mx-auto">
        <img
          src={selfieSideUrl}
          alt="side selfie"
          className="w-40 h-40 object-cover rounded-2xl"
        />
        {/* rectangle instead of circle, for profile */}
        <div className="absolute inset-3 rounded-xl border-2 border-amber-200/80 pointer-events-none" />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-100">
          Jawline visible — good
        </div>
      </div>
    ) : (
      <div className="mt-3 w-40 h-40 mx-auto rounded-2xl bg-black/30 border border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/40">
        no side selfie yet
      </div>
    )}
  </div>
</section>