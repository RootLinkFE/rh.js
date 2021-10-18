/*
 * @Author: mingxing.zhong
 * @Date: 2021-08-12 16:41:23
 * @Description: Demo
 */

import { Space } from 'antd';
import React, { useState } from 'react';
import RhEditableTagGroup from '.';

export default (): React.ReactNode => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div>
      <Space direction="vertical">
        <RhEditableTagGroup value={tags} onChange={setTags} />

        <div>tags: {JSON.stringify(tags)}</div>
      </Space>
    </div>
  );
};
