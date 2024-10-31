import React from 'react';

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <div>{`Hey, ${name}!`}</div>;
};

export default Greeting;
