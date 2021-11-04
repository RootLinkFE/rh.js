import React from 'react';
import { useState } from 'react';
import RhTitle from '.';

function Demo() {
  const [collapse, setCollapse] = useState(false);
  return (
    <div>
      <RhTitle
        title="基础信息"
        fontSize={14}
        showCollapse
        collapse={false}
        onCollapseChange={(v) => {
          setCollapse(v);
        }}
      >
        <h3>Hello!</h3>
      </RhTitle>

      <div style={{ marginTop: '20px' }}>
        collapse：{collapse ? 'true' : 'false'}
      </div>
    </div>
  );
}

export default Demo;
