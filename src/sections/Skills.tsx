import { useInView } from '../hooks/useInView'
import type { SkillCategoryValue } from '../types'
import { SKILL_CATEGORIES } from '../types'
import { SKILLS } from '../data/skills'

// Group skills by category, preserving SKILL_CATEGORIES order. Computed once at
// module level — the data is static, so there is nothing to recompute per render.
const GROUPED = SKILL_CATEGORIES.map((cat) => ({
  value: cat.value as SkillCategoryValue,
  label: cat.label,
  items: SKILLS.filter((s) => s.category === cat.value),
})).filter((g) => g.items.length > 0)

export default function Skills() {
  const { ref, inView } = useInView()

  return (
    <section ref={ref} id="skills" className={`py-24 bg-gray-900/50 fade-up ${inView ? 'visible' : ''}`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-14">
          <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-2">
            Skills
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            My stack
          </h2>
        </div>

        {/* Empty */}
        {GROUPED.length === 0 && (
          <p className="text-gray-500 text-sm">No skills listed yet.</p>
        )}

        {/* Grouped skills */}
        {GROUPED.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {GROUPED.map((group) => (
              <div key={group.value}>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-4">
                  {group.label}
                </p>
                <div className="space-y-4">
                  {group.items.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <span className="text-xs text-violet-400 font-semibold">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="bg-violet-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: inView ? `${skill.level}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
