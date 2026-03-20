import React from 'react'
import betService from '../../../../services/bet.service';
import { AxiosResponse } from 'axios';

const MarqueeAnnouncement = () => {


  const [notice, setNotice] = React.useState<any>();
  React.useEffect(() => {
   betService.getnotice().then((res: AxiosResponse<any>) => {
        setNotice(res.data.data);
      });
  }, []);



  const announcementText = '🏏 𝐓𝐇𝐄 𝐀𝐒𝐇𝐄𝐒 𝐒𝐏𝐄𝐂𝐈𝐀𝐋 𝐄𝐕𝐄𝐍𝐓 𝐁𝐄𝐓𝐒 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 🏆 𝐖𝐁𝐁𝐋 𝟐𝟎𝟐𝟓 🏆 𝐒𝐏𝐄𝐂𝐈𝐀𝐋 𝐅𝐀𝐍𝐂𝐘 & 𝐂𝐔𝐏 𝐖𝐈𝐍𝐍𝐄𝐑 𝐁𝐄𝐓𝐒 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 🏏 𝐏𝐋𝐀𝐘 𝐓𝐇𝐄 𝐆𝐄𝐍𝐈𝐄 𝐂𝐎𝐌𝐁𝐎 𝐒𝐏𝐄𝐂𝐈𝐀𝐋 𝐁𝐄𝐓 𝐈𝐍 𝐎𝐔𝐑 𝐄𝐗𝐂𝐇𝐀𝐍𝐆𝐄 𝐀𝐍𝐃 𝐌𝐔𝐋𝐓𝐈𝐏𝐋𝐘 𝐘𝐎𝐔𝐑 𝐖𝐈𝐍𝐍𝐈𝐍𝐆𝐒'

  return (
    <div className='marquee-announcement'>
      <div className='marquee-content'>
        <span>{notice?.bnotice}</span>
        {/* <span>{notice?.bnotice}</span> */}
      </div>
    </div>
  )
}

export default MarqueeAnnouncement
