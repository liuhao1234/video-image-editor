import React,{ useMemo, useEffect, useRef } from 'react'
import type { VideoTrackItem,TrackItem } from '@/store/trackStore';
import { useTrackStore, useVideoStore } from '@/store'
import { getGridPixel } from '@/utils/timelineUtils'

const TrackHandler: React.FC<{ data: TrackItem }> = ({ data }) => {
  const { selectTrackItem,trackList,setTrackList,trackScale } = useTrackStore()
  const { setFrameCount,setPlayMomentFrame } = useVideoStore()
  const isActive = useMemo(() => selectTrackItem?.id === data.id, [selectTrackItem, data.id])
  const canDrag = useRef(false)
  const dragDirection = useRef<'left'|'right'>('left')
  const dragStartX = useRef(0)
  const frameWidth = useMemo(() => getGridPixel(trackScale,1), [trackScale])
  const oldFrame = useRef(0)
  const handleMouseMove = (event: MouseEvent) => {
    if(!canDrag.current) return
    const dragDistance = event.pageX - dragStartX.current
    const dragFrame = Math.round(dragDistance / frameWidth)
    let frameCount = 0
    const newTrackList = trackList.map((trackLine) => {
      if(trackLine.type === data.type){
        trackLine.list.map((item) => {
          if(item.id === data.id){
            if(dragDirection.current === 'left'){
              if(item.start + dragFrame - oldFrame.current >= 0){
                item.start += dragFrame - oldFrame.current
                setPlayMomentFrame(item.start)
              }
            }
            if(dragDirection.current === 'right'){
              if(item.end + dragFrame - oldFrame.current <= (item as VideoTrackItem).frameCount){
                item.end += dragFrame - oldFrame.current
                setPlayMomentFrame(item.end)
              }
            }
          }
          frameCount += item.end - item.start
        })
      }
      return trackLine
    })
    setFrameCount(frameCount)
    setTrackList(newTrackList)
    oldFrame.current = dragFrame
  }
  const handleMouseDown = (event: React.MouseEvent,direction:'left'|'right') => {
    canDrag.current = true
    dragDirection.current = direction
    dragStartX.current = event.pageX
  }
  const handleMouseUp = () => {
    canDrag.current = false
    dragStartX.current = 0
    oldFrame.current = 0
    setPlayMomentFrame(null)
  }
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }, [])
  return isActive && <div className='handler'>
    <span className='handler-icon handler-left' onMouseDown={(event) => handleMouseDown(event,'left')}>|</span>
    <span className='handler-icon handler-right' onMouseDown={(event) => handleMouseDown(event,'right')}>|</span>
  </div>
}
export default React.memo(TrackHandler)
  