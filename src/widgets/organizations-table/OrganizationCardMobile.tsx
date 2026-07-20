import { OrganizationWithCounts } from '@/entities/organization';
import React from 'react'

type OrganizationCardProps = {
  data: OrganizationWithCounts;
};

const OrganizationCardMobile = ({data} : OrganizationCardProps) => {
 
  return (
    <div className="w-full bg-muted p-2 grid gap-2">
        <div className="p-4  text-center grid gap-1 rounded-xl">
            <span>{data.name}</span>
            <span>ИНН:{data.inn}</span>
        </div>
        <div className='grid grid-cols-2 gap-2'>
            <div className="p-3  grid rounded-xl">
                <span>Номер договора: {data.contractNumber}</span>
                <span>Время поддержки:</span>
                <span>{data.timeSupportFrom} -  {data.timeSupportTo}</span>
            </div>
            <div className="p-4  grid rounded-xl">
                <span>Срок договора:</span>
                <span>{Intl.DateTimeFormat("ru").format(data.contractStart)} -  {Intl.DateTimeFormat("ru").format(data.contractEnd)}</span>
            </div>
        </div>
        {data.description && <div className="p-3  grid rounded-xl">
            <span className='break-words whitespace-pre-wrap'>{data.description}</span>
        </div>}
        
        <div className="p-4  grid gap-2 rounded-xl">
            {data.actualAddress && 
            <div className='grid place-items-center'>
                <span >Адрес фактический:</span>
                <span>{data.actualAddress}</span>
            </div>}
         <div className='grid place-items-center'>
            <span>Адрес юридический:</span>
            <span>{data.legalAddress}</span>
        </div>
        </div>
    </div>
  )
}

export default OrganizationCardMobile