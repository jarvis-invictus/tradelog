'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

type Rule = {
  id: string
  user_id: string
  name: string
  type: string
  value: number | null
  note: string | null
  active: boolean
  created_at: string
  [key: string]: unknown
}

const RULE_TYPES = [
  { key: 'max_trades_day',  label: 'Max trades per day',     placeholder: '3',   unit: 'trades' },
  { key: 'daily_loss_pct',  label: 'Daily loss % of balance',placeholder: '2',   unit: '% of balance' },
  { key: 'loss_limit',      label: 'Loss limit (₹)',         placeholder: '2000',unit: '₹' },
  { key: 'no_trade_after',  label: 'No trading after hour',  placeholder: '17',  unit: ':00 (24h)' },
  { key: 'pair_ban',        label: 'Banned pair',            placeholder: 'e.g. GBPJPY', unit: '' },
  { key: 'min_rr',          label: 'Minimum R:R ratio',      placeholder: '1.5', unit: ':1 R:R' },
]

export default function RulesScreen({ rules: initialRules, userId }: { rules: Rule[]; userId: string }) {
  const supabase = createClient()
  const [rules, setRules]         = useState<Rule[]>(initialRules)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [name, setName]           = useState('')
  const [type, setType]           = useState('max_trades_day')
  const [value, setValue]         = useState('')
  const [note, setNote]           = useState('')
  const [saving, setSaving]       = useState(false)

  async function addRule() {
    if (!name.trim()) return
    setSaving(true)
    const numValue = value ? parseFloat(value) : null
    const { data, error } = await supabase
      .from('user_rules')
      .insert({
        user_id:      userId,
        name,
        type,
        value:        numValue,
        note:         note || null,
        active:       true,
        definition:   numValue != null ? { value: numValue } : {},
        personal_note: note || null,
      })
      .select()
      .single()
    if (!error && data) {
      setRules((r) => [data as unknown as Rule, ...r])
      setName(''); setType('max_trades_day'); setValue(''); setNote('')
      setSheetOpen(false)
    }
    setSaving(false)
  }

  async function toggleRule(id: string, current: boolean) {
    await supabase.from('user_rules').update({ active: !current }).eq('id', id)
    setRules((r) => r.map((rule) => rule.id === id ? { ...rule, active: !current } : rule))
  }

  async function deleteRule(id: string) {
    await supabase.from('user_rules').delete().eq('id', id)
    setRules((r) => r.filter((rule) => rule.id !== id))
  }

  const selectedType = RULE_TYPES.find((t) => t.key === type)

  return (
    <>
      <div className="space-y-3">
        {/* Add rule button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="btn-primary !w-auto px-4 py-2.5 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add rule
        </button>

        {/* Rules list */}
        {rules.length === 0 ? (
          <div className="empty-state card py-16">
            <Shield className="empty-state-icon w-10 h-10" />
            <p className="empty-state-text">No rules yet. Add your first guardrail to protect your trading capital.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`card p-4 flex items-start gap-4 transition-all duration-150 ${!rule.active ? 'opacity-50' : ''}`}
              >
                <Shield className={`w-5 h-5 mt-0.5 shrink-0 ${rule.active ? 'text-brand-400' : 'text-ink-tertiary'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-ink-primary font-semibold text-sm">{rule.name}</p>
                  <p className="text-ink-tertiary text-xs mt-0.5 capitalize">
                    {RULE_TYPES.find((t) => t.key === rule.type)?.label ?? rule.type}
                    {rule.value != null ? ` · ${rule.value}${RULE_TYPES.find((t) => t.key === rule.type)?.unit ?? ''}` : ''}
                  </p>
                  {rule.note && (
                    <p className="text-ink-secondary text-xs mt-1.5 italic leading-relaxed">
                      &ldquo;{rule.note}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleRule(rule.id, rule.active)}
                    className="text-ink-tertiary hover:text-ink-primary transition-colors duration-150"
                  >
                    {rule.active
                      ? <ToggleRight className="w-6 h-6 text-brand-400" />
                      : <ToggleLeft className="w-6 h-6" />
                    }
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="text-ink-tertiary hover:text-danger-text transition-colors duration-150"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add rule sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end pointer-events-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />
          <div className="relative bg-surface-700 border-t border-surface-300 rounded-t-[4px] max-h-[90dvh] overflow-y-auto pb-safe animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-surface-300 rounded-full" />
            </div>
            <div className="px-4 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-ink-primary font-semibold text-base">New rule</h2>
                <button onClick={() => setSheetOpen(false)} className="text-ink-tertiary hover:text-ink-secondary text-sm transition-colors">Cancel</button>
              </div>

              <div>
                <p className="section-label mb-2">Rule name</p>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. No more than 3 trades per day"
                  className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary transition-colors duration-150"
                />
              </div>

              <div>
                <p className="section-label mb-2">Rule type</p>
                <div className="flex flex-col gap-1.5">
                  {RULE_TYPES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setType(t.key)}
                      className={`text-left px-3 py-2.5 rounded-[4px] text-sm border transition-all duration-150 ${
                        type === t.key
                          ? 'border-brand-400/60 text-brand-400 bg-brand-400/10'
                          : 'border-surface-300 bg-surface-600 text-ink-secondary hover:bg-surface-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && selectedType.unit && (
                <div>
                  <p className="section-label mb-2">Value {selectedType.unit && `(${selectedType.unit})`}</p>
                  <input
                    value={value} onChange={(e) => setValue(e.target.value)}
                    placeholder={selectedType.placeholder}
                    type={selectedType.key === 'pair_ban' ? 'text' : 'number'}
                    className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary transition-colors duration-150"
                  />
                </div>
              )}

              <div>
                <p className="section-label mb-2">Why this rule? (optional)</p>
                <textarea
                  value={note} onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Remind your future self why you set this..."
                  className="w-full bg-surface-600 border border-surface-300 focus:border-brand-400 focus:outline-none rounded-[4px] px-3 py-3 text-ink-primary text-sm placeholder:text-ink-tertiary resize-none transition-colors duration-150"
                />
              </div>

              <button onClick={addRule} disabled={saving || !name.trim()} className="btn-primary py-3">
                {saving ? 'Saving…' : 'Add rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
