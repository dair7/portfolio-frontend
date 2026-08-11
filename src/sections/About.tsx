const highlights = [
  { label: 'Backend', value: 'Java & Spring Boot' },
  { label: 'Frontend', value: 'React & TypeScript' },
  { label: 'Database', value: 'PostgreSQL' },
  { label: 'Focus', value: 'Clean Code & REST APIs' },
]

import { useInView } from '../hooks/useInView'

export default function About() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} id="about" className={`py-24 bg-gray-950 fade-up ${inView ? 'visible' : ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-2">
            About
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            A bit about me
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-5 text-gray-400 leading-relaxed">
            <p>
              I'm a full stack developer who enjoys building products that pair a
              solid backend with modern, fast interfaces.
            </p>
            <p>
              I specialize in the Java ecosystem with Spring Boot for REST APIs,
              and on the frontend I work with React and TypeScript to build clean,
              functional user experiences.
            </p>
            <p>
              When I'm not coding, I'm usually learning something new or figuring
              out how to improve code I've already written.
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
            >
              Let's talk
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors duration-300"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-white font-semibold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
