import React from 'react';
import { useState } from 'react';
import RhEditableLabel from '.';

function Demo() {
  const [value, setValue] = useState('LeekHub');
  return (
    <div>
      <RhEditableLabel
        value={value}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue(v);
        }}
      />
    </div>
  );
}

export default Demo;
