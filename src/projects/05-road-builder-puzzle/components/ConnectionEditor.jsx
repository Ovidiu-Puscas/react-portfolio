import React from 'react';
import Title from '../../../projects/components/Title';
import Button from '../../components/Button';

const ConnectionEditor = ({
  selectedTileType,
  setSelectedTileType,
  editableConnections,
  toggleConnection,
  exportConnections,
  resetConnections,
  getTileImage,
  getAllTileTypes
}) => {
  return (
    <div className="connection-editor">
      <div className="editor-header">
        <Title title={{ heading: 'h3', text: 'Visual Road Connection Editor', class: '' }} />
        <div className="editor-controls">
          <Button
            onClick={exportConnections}
            variant="primary"
            icon="💾"
          >
            Export JSON
          </Button>
          <Button
            onClick={resetConnections}
            variant="secondary"
            icon="🔄"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="editor-content">
        <div className="tile-selector">
          <h4>Select Tile Type:</h4>
          <div className="tile-grid">
            {getAllTileTypes().map(tileType => (
              <div
                key={tileType}
                className={`tile-option ${selectedTileType === tileType ? 'selected' : ''}`}
                onClick={() => setSelectedTileType(tileType)}
              >
                <div
                  className="tile-preview"
                  style={{
                    backgroundImage: `url(${getTileImage(tileType)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <span className="tile-name">{tileType.replace('roads', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedTileType && (
          <div className="connection-editor-panel">
            <h4>Editing: {selectedTileType}</h4>
            <div className="connection-sides">
              {['top', 'right', 'bottom', 'left'].map(side => (
                <div key={side} className="side-connections">
                  <h5>{side.toUpperCase()} Connections:</h5>
                  <div className="connection-tiles">
                    {getAllTileTypes().map(targetTile => (
                      <label
                        key={targetTile}
                        className="connection-option"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTileType && editableConnections[selectedTileType] && editableConnections[selectedTileType][side] ? editableConnections[selectedTileType][side].includes(targetTile) : false}
                          onChange={() => toggleConnection(selectedTileType, side, targetTile)}
                        />
                        <div
                          className="connection-tile-preview"
                          style={{
                            backgroundImage: `url(${getTileImage(targetTile)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        ></div>
                        <span>{targetTile.replace('roads', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionEditor;
