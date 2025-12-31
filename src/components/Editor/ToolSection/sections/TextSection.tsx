interface TextSectionProps {
  style: React.CSSProperties
}

const TextSection: React.FC<TextSectionProps> = ({ style }) => {
  return (
    <div style={ style }>
      text
    </div>
  )
}
export default TextSection;