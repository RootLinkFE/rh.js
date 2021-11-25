import { FormOutlined } from '@ant-design/icons';
import RhIcon from '.';
import React from 'react';

function Demo() {
  return (
    <>
      <div>
        <RhIcon src="rh-icon-node-channel" imageSize={18}></RhIcon>
        <RhIcon src="rh-icon-node-channel" imageSize={24} fontSize={22}>
          通道
        </RhIcon>
        <RhIcon src="rh-icon-node-device" imageSize={24}></RhIcon>
        <RhIcon src="rh-icon-kefu">客服</RhIcon>
        <RhIcon src={<FormOutlined />}>编辑</RhIcon>
      </div>
      <br />
      <div>
        <RhIcon
          imageSize={32}
          src="https://gw.alicdn.com/tfs/TB1HxCbreL2gK0jSZPhXXahvXXa-65-70.gif"
          fontSize={18}
        >
          图片链接
        </RhIcon>
      </div>
    </>
  );
}

export default Demo;
