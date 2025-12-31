interface CaptionSectionProps {
  style: React.CSSProperties
}

const CaptionSection: React.FC<CaptionSectionProps> = ({ style }) => {
  return (
    <div style={ style }>
      caption
    </div>
  )
}
export default CaptionSection;