import { useParams } from 'react-router-dom';

export default function Video() {
  const { id } = useParams();


  return (
    <div>
      <iframe width="1280" height="720" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
    </div>
  )
}
