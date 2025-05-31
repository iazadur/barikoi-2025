import React from 'react'
import { Poi } from './pois-columns'
import { ExportMenu } from './export-menu'

interface TableHeaderProps {
    data: Poi[]
}

const TableHeader = ({ data }: TableHeaderProps) => {
    return (
        <div className='flex w-full justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm'>
            <div className='flex flex-col gap-1'>
                <h2 className="text-2xl font-bold text-slate-800">POI Management</h2>
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <span className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                        Total POIs: <span className='font-semibold text-slate-800'>{data.length}</span>
                    </span>
                    <span className='text-slate-400'>•</span>
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            <div className='flex items-center gap-3'>
                {/* Export Statistics */}
                <div className='hidden md:flex flex-col items-end text-xs text-slate-500'>
                    <span>Ready for export</span>
                    <span className='font-medium text-slate-700'>{data.length} records</span>
                </div>

                {/* Advanced Export Menu */}
                <ExportMenu data={data} />
            </div>
        </div>
    )
}

export default TableHeader