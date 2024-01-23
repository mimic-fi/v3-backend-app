import React from 'react';
import createIcon from './blockies-utils';
import styled from 'styled-components';

interface BlockiesProps {
  address: string;
  imageSize?: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
  className?: string;
}

const Blockies: React.FC<BlockiesProps> = ({
  address = ' ',
  imageSize = 42,
  color,
  bgcolor,
  spotcolor,
  className,
}) => {

  const imgURL = createIcon({
    seed: address.toLowerCase(),
    size: 8,
    scale: 5,
    color,
    bgcolor,
    spotcolor,
  }).toDataURL();

  const style: React.CSSProperties = {
    backgroundImage: 'url(' + imgURL + ')',
    backgroundSize: 'cover',
    width: imageSize + 'px',
    height: imageSize + 'px',
    display: 'inline-block',
  };

  return <span className={className} style={style} />;
};

export default Blockies;

export const SingleNameBlockies = styled(Blockies)`
  margin-right: 5px;
  border-radius: 50%;
  flex-shrink: 0;
`;
