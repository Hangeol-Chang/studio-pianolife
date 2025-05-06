
import FourMusicsPlayer from '@/components/fourmusics/fourmusicsPlayer';
import { mediaInfos } from '../media.json';

export default function FourMusicsMedia() {
    return (
        <div>
            {/* TODO : Fourmusic Player를 여기로 옮겨올 것. */}
            포뮤직스 미디어 입니당.
            <FourMusicsPlayer mediaInfos={mediaInfos}/>
        </div>
    )
}