import React from 'react';
import TestRenderer from 'react-test-renderer';
import { createRenderer } from 'react-test-renderer/shallow';
import RhSearchInput from '../index';

it('RhSearchInput renders correctly', () => {
  const renderer = createRenderer();

  renderer.render(
    <RhSearchInput
      size="small"
      suffix={null}
      onSearch={(v) => {
        console.log(v);
      }}
    />,
  );
  const result = renderer.getRenderOutput();
  expect(result).toMatchSnapshot();
});
