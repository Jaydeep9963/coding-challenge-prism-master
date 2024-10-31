// PropertiesPanel.tsx
import React, { useState } from 'react';
import './PropertiesPanel.css';
import MarginsAndPadding from './components/MarginsAndPadding';

const Collapsible: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="Collapsible">
      <button className="Collapsible-button" onClick={() => setCollapsed((prev) => !prev)}>
        <span>{title}</span> <span>{collapsed ? '+' : '-'}</span>
      </button>
      {!collapsed && <div className="Collapsible-content">{children}</div>}
    </section>
  );
};

// Define the shape of the data returned by the /examples endpoint
// interface Example {
//   id: number;
//   some_int: number;
//   some_text: string;
// }

// const ViewExamples: React.FC = () => {
//   const [examples, setExamples] = useState<Example[] | null>(null);

//   useEffect(() => {
//     // Fetch the data from /examples and set the state when the promise resolves
//     fetch('http://localhost:12346/examples')
//       .then((response) => response.json())
//       .then((data) => {
//         setExamples(data);
//       })
//       .catch((error) => console.error('Error fetching examples:', error));
//   }, []);

//   return (
//     <div>
//       {examples === null ? (
//         <span>Loading examples....</span>
//       ) : (
//         examples.map((example) => (
//           <span key={example.id}>{`Int: ${example.some_int}, Str: ${example.some_text}`}</span>
//         ))
//       )}
//     </div>
//   );
// };

const PropertiesPanel: React.FC = () => {
  return (
    <aside className="PropertiesPanel">
      {/* <Collapsible title="Load examples">
        <ViewExamples />
      </Collapsible> */}
      <Collapsible title="Margins & Padding">
        <MarginsAndPadding />
      </Collapsible>
      <Collapsible title="Size">
        <span>{'example'}</span>
      </Collapsible>
    </aside>
  );
};

export default PropertiesPanel;
