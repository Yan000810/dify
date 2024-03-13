'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import produce from 'immer'
import type { OutputVar } from '../../../code/types'
import RemoveButton from '../remove-button'
import VarTypePicker from './var-type-picker'
import type { VarType } from '@/app/components/workflow/types'

type Props = {
  readonly: boolean
  outputs: OutputVar
  onChange: (payload: OutputVar) => void
}

const OutputVarList: FC<Props> = ({
  readonly,
  outputs,
  onChange,
}) => {
  const list = (Object.keys(outputs)).map((key) => {
    return {
      variable: key,
      variable_type: outputs[key].type,
    }
  })
  const handleVarNameChange = useCallback((index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const oldKey = list[index].variable
      const newOutputs = produce(outputs, (draft) => {
        const newKey = e.target.value
        draft[newKey] = draft[oldKey]
        delete draft[oldKey]
      })
      onChange(newOutputs)
    }
  }, [list, onChange])

  const handleVarTypeChange = useCallback((index: number) => {
    return (value: string) => {
      const key = list[index].variable
      const newOutputs = produce(outputs, (draft) => {
        draft[key].type = value as VarType
      })
      onChange(newOutputs)
    }
  }, [list, onChange])

  const handleVarRemove = useCallback((index: number) => {
    return () => {
      const key = list[index].variable
      const newOutputs = produce(outputs, (draft) => {
        delete draft[key]
      })
      onChange(newOutputs)
    }
  }, [list, onChange])

  return (
    <div className='space-y-2'>
      {list.map((item, index) => (
        <div className='flex items-center space-x-1' key={index}>
          <input
            readOnly={readonly}
            value={item.variable}
            onChange={handleVarNameChange(index)}
            className='w-0 grow h-8 leading-8 px-2.5 rounded-lg border-0 bg-gray-100  text-gray-900 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200'
            type='text' />
          <VarTypePicker
            readonly={readonly}
            value={item.variable_type}
            onChange={handleVarTypeChange(index)}
          />
          <RemoveButton
            className='!p-2 !bg-gray-100 hover:!bg-gray-200'
            onClick={handleVarRemove(index)}
          />
        </div>
      ))}
    </div>
  )
}
export default React.memo(OutputVarList)
