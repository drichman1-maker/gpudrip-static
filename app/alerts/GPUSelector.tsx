'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

export interface GPUSelectorGPU {
    id: string
    model: string
    manufacturer?: string
}

interface GPUSelectorProps {
    gpus: GPUSelectorGPU[]
    selectedGpus: string[]
    onSelect: (selectedIds: string[]) => void
    disabled?: boolean
}

export default function GPUSelector({ gpus, selectedGpus, onSelect, disabled }: GPUSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBrand, setSelectedBrand] = useState<string>('all')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Get unique brands
    const brands = useMemo(() => {
        const brandSet = new Set<string>()
        gpus.forEach(gpu => {
            if (gpu.manufacturer) {
                brandSet.add(gpu.manufacturer)
            }
        })
        return ['all', ...Array.from(brandSet).sort()]
    }, [gpus])

    // Filter by brand and search
    const filteredGpus = useMemo(() => {
        let filtered = gpus
        if (selectedBrand !== 'all') {
            filtered = filtered.filter(gpu => gpu.manufacturer === selectedBrand)
        }
        if (searchTerm) {
            filtered = filtered.filter(gpu =>
                gpu.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (gpu.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        return filtered
    }, [gpus, selectedBrand, searchTerm])

    const selectedGpuObjects = gpus.filter((gpu: GPUSelectorGPU) => selectedGpus.includes(gpu.id))

    const handleToggleGpu = (gpuId: string) => {
        if (selectedGpus.includes(gpuId)) {
            // Remove if already selected
            onSelect(selectedGpus.filter(id => id !== gpuId))
        } else {
            // Add if under limit
            if (selectedGpus.length < 5) {
                onSelect([...selectedGpus, gpuId])
            }
        }
    }

    const handleRemoveGpu = (gpuId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect(selectedGpus.filter(id => id !== gpuId))
    }

    return (
        <div className="gpu-selector" ref={dropdownRef}>
            <label className="form-label">
                GPU to Watch <span className="text-muted">({selectedGpus.length}/5)</span>
            </label>
            
            {/* Selected GPUs Chips */}
            {selectedGpus.length > 0 && (
                <div className="selected-gpus">
                    {selectedGpuObjects.map((gpu: GPUSelectorGPU) => (
                        <span key={gpu.id} className="gpu-chip">
                            {gpu.model}
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={(e) => handleRemoveGpu(gpu.id, e)}
                                disabled={disabled}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            
            {/* Dropdown Toggle */}
            <button
                type="button"
                className={`selector-trigger ${isOpen ? 'open' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled || selectedGpus.length >= 5}
            >
                {selectedGpus.length >= 5 
                    ? 'Maximum 5 GPUs selected' 
                    : selectedGpus.length === 0 
                        ? 'Choose GPUs to watch...' 
                        : 'Add more GPUs...'}
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search GPUs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    {/* Brand Filter Pills */}
                    <div className="brand-filters">
                        {brands.map(brand => (
                            <button
                                key={brand}
                                type="button"
                                className={`brand-pill ${selectedBrand === brand ? 'active' : ''}`}
                                onClick={() => setSelectedBrand(brand)}
                            >
                                {brand === 'all' ? 'All' : brand}
                            </button>
                        ))}
                    </div>
                    
                    <div className="gpu-list">
                        {filteredGpus.length === 0 ? (
                            <div className="no-results">No GPUs found</div>
                        ) : (
                            filteredGpus.map((gpu: GPUSelectorGPU) => {
                                const isSelected = selectedGpus.includes(gpu.id)
                                return (
                                    <div
                                        key={gpu.id}
                                        className={`gpu-option ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleToggleGpu(gpu.id)}
                                    >
                                        <span className="checkbox">
                                            {isSelected ? '☑' : '☐'}
                                        </span>
                                        <span className="gpu-name">{gpu.model}</span>
                                        <span className="manufacturer">{gpu.manufacturer || 'Unknown'}</span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    
                    <div className="dropdown-footer">
                        {selectedGpus.length}/5 GPUs selected
                    </div>
                </div>
            )}

            <style jsx>{`
                .gpu-selector {
                    position: relative;
                    margin-bottom: 1rem;
                }
                
                .selected-gpus {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }
                
                .gpu-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.375rem 0.75rem;
                    background: var(--blue);
                    color: white;
                    border-radius: 100px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .remove-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border: none;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                    padding: 0;
                    margin-left: 0.25rem;
                }
                
                .remove-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .selector-trigger {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    color: var(--text);
                    font-size: 1rem;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }
                
                .selector-trigger:hover:not(:disabled) {
                    border-color: var(--blue);
                }
                
                .selector-trigger:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .selector-trigger.open {
                    border-color: var(--blue);
                }
                
                .arrow {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 0.5rem;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                    z-index: 100;
                    max-height: 400px;
                    display: flex;
                    flex-direction: column;
                }
                
                .search-box {
                    padding: 0.75rem;
                    border-bottom: 1px solid var(--border);
                }
                
                .search-box input {
                    width: 100%;
                    padding: 0.625rem 1rem;
                    background: var(--bg);
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    color: var(--text);
                    font-size: 0.875rem;
                }
                
                .search-box input:focus {
                    outline: none;
                    border-color: var(--blue);
                }
                
                .brand-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    border-bottom: 1px solid var(--border);
                }
                
                .brand-pill {
                    padding: 0.375rem 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: 100px;
                    background: var(--bg);
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                
                .brand-pill:hover {
                    border-color: var(--blue);
                    color: var(--blue);
                }
                
                .brand-pill.active {
                    background: var(--blue);
                    border-color: var(--blue);
                    color: white;
                }
                
                .gpu-list {
                    overflow-y: auto;
                    max-height: 280px;
                    padding: 0.5rem 0;
                }
                
                .gpu-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                
                .gpu-option:hover {
                    background: var(--bg);
                }
                
                .gpu-option.selected {
                    background: rgba(59, 130, 246, 0.1);
                }
                
                .checkbox {
                    font-size: 1.25rem;
                    line-height: 1;
                    color: var(--blue);
                }
                
                .gpu-name {
                    flex: 1;
                    font-weight: 500;
                }
                
                .manufacturer {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    background: var(--bg);
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }
                
                .no-results {
                    padding: 2rem;
                    text-align: center;
                    color: var(--text-muted);
                }
                
                .dropdown-footer {
                    padding: 0.75rem 1rem;
                    border-top: 1px solid var(--border);
                    text-align: center;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                
                .text-muted {
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    )
}
