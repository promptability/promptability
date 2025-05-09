// src/Sandbox.jsx
import React, { useState } from 'react';
import Button from './common/Button';
import Spinner from './common/Spinner';
import Dropdown from './common/Dropdown';

// Export default Sandbox component
export default function Sandbox() {
  const [selectedComponent, setSelectedComponent] = useState('Button');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Button':
        return (
          <div className="flex flex-col space-y-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button loading>Loading Button</Button>
          </div>
        );
      case 'Spinner':
        return (
          <div className="flex space-x-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        );
      case 'Dropdown':
        return (
          <Dropdown
            options={[
              { id: 'opt1', label: 'Option 1' },
              { id: 'opt2', label: 'Option 2' },
              { id: 'opt3', label: 'Option 3' },
            ]}
            selectedId="opt1"
            onChange={(option) => console.log('Selected:', option)}
          />
        );
      default:
        return <div>Select a component to preview</div>;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Component Sandbox</h1>
      
      <div className="flex gap-2 mb-8">
        {['Button', 'Spinner', 'Dropdown'].map((comp) => (
          <button
            key={comp}
            className={`px-3 py-1 rounded ${selectedComponent === comp ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedComponent(comp)}
          >
            {comp}
          </button>
        ))}
      </div>
      
      <div className="border p-6 rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-4">{selectedComponent} Preview</h2>
        {renderComponent()}
      </div>
    </div>
  );
}