export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Redesign',
      description: 'A dark-themed high converting digital storefront with 3d transitions.',
      tags: ['Next.js', 'WebGL', 'Tailwind'],
    },
    {
      id: 2,
      title: 'Agency Portfolio',
      description: 'Award-winning immersive scrollytelling experience for a design agency.',
      tags: ['React', 'Framer Motion', 'Canvas'],
    },
    {
      id: 3,
      title: 'Fintech Dashboard',
      description: 'Real-time data visualization with fluid interactive charts.',
      tags: ['TypeScript', 'D3.js', 'CSS Modules'],
    },
    {
      id: 4,
      title: 'AI Companion App',
      description: 'Conversational interface featuring generative UI and voice interactions.',
      tags: ['Next.js', 'OpenAI', 'WebRTC'],
    },
  ];

  return (
    <section className="relative z-10 bg-[#121212] pt-24 pb-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight text-white drop-shadow-md">
          Selected Works
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group relative flex flex-col p-8 md:p-10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 border border-white/5 bg-white/5 backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium tracking-wider text-neutral-300 bg-white/10 px-3 py-1 rounded-full uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-2xl md:text-4xl font-semibold mb-4 text-white group-hover:text-blue-200 transition-colors duration-300">
                  {project.title}
                </h4>
                <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-sm">
                  {project.description}
                </p>

                <div className="mt-12 overflow-hidden flex items-center gap-4 text-white font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                  <span>View Case Study</span>
                  <div className="w-8 h-[1px] bg-white group-hover:w-16 transition-all duration-500 ease-out"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
