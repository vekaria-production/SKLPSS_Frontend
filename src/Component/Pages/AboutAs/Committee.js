import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import member from '../../../assets/member.png';
import President from '../../../assets/president.png';
import axios from 'axios';
import { useOptions } from "../../../hooks/useOptions";

export default function CommitteeTreeWithModal() {
  const {
    position,
    refresh,
    loading: optionsLoading,
    errors: optinoErrors
  } = useOptions();
  console.log("Positions from context:", position);
  const containerRef = useRef(null);
  const [membersList, setMembersList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const nodesRefs = useRef(new Map());
  const [lines, setLines] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [levels, setLevels] = useState([]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {

      const formData = new FormData();
      formData.append('excludePosition', 5);
      try {
        // Fetch members
        const membersResponse = await axios.get(
          `${process.env.REACT_APP_NETWORK}/getMemberList`,formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        let membersData = membersResponse.data;
        if (typeof membersData === 'string') {
          membersData = JSON.parse(membersData);
        }
        setMembersList(membersData);
        console.log("Members Data:", membersData);
        // Use the position from useOptions, map to objects
        setPositionList(position.map(([id, name, parentId]) => ({ id, name, parentId })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    fetchData();
  }, [position]);

  // Build tree structure for hierarchy
  useEffect(() => {
    if (positionList.length > 0 && membersList.length > 0) {
      const newLevels = buildTree(positionList, membersList);
      setLevels(newLevels);
    }
  }, [positionList, membersList]);

  function buildTree(positions, members) {
    // Filter out the "Member" position (ID 5)
    const filteredPositions = positions.filter(p => p.id !== 5);
    const posMap = new Map(filteredPositions.map(p => [p.id, p]));
    const memMap = new Map();
    members.forEach(m => {
      if (!memMap.has(m.Position)) memMap.set(m.Position, []);
      memMap.get(m.Position).push(m);
    });

    const nodes = [];
    filteredPositions.forEach(p => {
      let mems = memMap.get(p.id) || [];
      if (mems.length === 0) return;

      const hasChildren = filteredPositions.some(cp => cp.parentId === p.id);
      if (hasChildren && mems.length > 1) {
        console.warn(`Position ${p.name} has children and multiple members, taking first`);
        mems = [mems[0]];
      }

      mems.forEach(m => {
        const isMulti = mems.length > 1;
        const uniqueId = isMulti ? `${p.id}-${m.Id}` : `${p.id}`;
        const node = {
          uniqueId,
          posId: p.id,
          parentPosId: p.parentId,
          title: p.name,
          name: `${m.Fname} ${m.LName}`,
          img: m.Image || (p.id === 1 ? President : member),
          details: `Email: ${m.Email}\nContact: ${m.Contact}`,
          memberData: m
        };
        nodes.push(node);
      });
    });

    // Find root(s) - assuming one
    const roots = nodes.filter(n => n.parentPosId === null);

    // BFS to build levels
    const levels = [];
    const queue = roots.map(root => ({ node: root, level: 0 }));
    const visited = new Set();

    while (queue.length > 0) {
      const { node, level } = queue.shift();
      if (visited.has(node.uniqueId)) continue;
      visited.add(node.uniqueId);

      if (!levels[level]) levels[level] = [];
      levels[level].push(node);

      // Find child positions
      const childPositions = filteredPositions.filter(cp => cp.parentId === node.posId);
      childPositions.forEach(cp => {
        // Find all nodes (members) for this child position
        const childNodes = nodes.filter(cn => cn.posId === cp.id);
        childNodes.forEach(childNode => {
          queue.push({ node: childNode, level: level + 1 });
        });
      });
    }

    // Sort each level by posId
    levels.forEach(lvl => lvl.sort((a, b) => a.posId - b.posId));

    return levels;
  }

  // Add ref for nodes
  const addNodeRef = (uniqueId) => (el) => {
    if (el && !nodesRefs.current.has(uniqueId)) {
      nodesRefs.current.set(uniqueId, el);
    }
  };

  // Calculate connector lines between nodes
  useLayoutEffect(() => {
    function calculateLines() {
      if (!containerRef.current || levels.length === 0) {
        return;
      }

      const allNodes = levels.flat();
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLines = [];

      allNodes.forEach((node) => {
        if (node.parentPosId) {
          const parentEl = nodesRefs.current.get(`${node.parentPosId}`);
          const childEl = nodesRefs.current.get(node.uniqueId);
          if (!parentEl || !childEl) return;

          const parentRect = parentEl.getBoundingClientRect();
          const childRect = childEl.getBoundingClientRect();
          const startX = parentRect.left + parentRect.width / 2 - containerRect.left;
          const startY = parentRect.bottom - containerRect.top;
          const endX = childRect.left + childRect.width / 2 - containerRect.left;
          const endY = childRect.top - containerRect.top;
          const controlPoint1 = { x: startX, y: (startY + endY) / 2 };
          const controlPoint2 = { x: endX, y: (startY + endY) / 2 };
          newLines.push({
            startX,
            startY,
            endX,
            endY,
            controlPoint1,
            controlPoint2,
            parentId: `${node.parentPosId}`,
            childId: node.uniqueId,
          });
        }
      });

      setLines(newLines);
    }

    const timer = setTimeout(calculateLines, 300);
    const resizeObserver = new ResizeObserver(calculateLines);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [levels]);

  // Handle card click
  const handleCardClick = (data) => {
    setModalData(data);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setModalData(null), 300);
  };

  if (levels.length === 0 || membersList.length === 0 || positionList.length === 0) {
    return <div className="text-center py-10">Loading committee data...</div>;
  }

  return (
    <section ref={containerRef} className="relative">
      <h2 className="text-3xl font-extrabold mb-12 text-center tracking-tight text-gray-800">
        Our Committee
      </h2>

      {/* SVG connectors */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1, overflow: 'visible' }}
      >
        {lines.map((line, i) => (
          <AnimatedPath
            key={i}
            d={`M${line.startX},${line.startY} C${line.controlPoint1.x},${line.controlPoint1.y} ${line.controlPoint2.x},${line.controlPoint2.y} ${line.endX},${line.endY}`}
            highlighted={hoveredIndex !== null && (line.parentId === hoveredIndex || line.childId === hoveredIndex)}
          />
        ))}
      </svg>

      {/* Render levels */}
      {levels.map((levelNodes, levelIdx) => (
        <div
          key={levelIdx}
          className="flex justify-center flex-wrap gap-x-10 gap-y-8 mb-20 max-w-5xl mx-auto relative"
        >
          {levelNodes.map((node) => (
            <div
              key={node.uniqueId}
              onMouseEnter={() => setHoveredIndex(node.uniqueId)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(node)}
              style={{ cursor: 'pointer', position: 'relative' }}
              aria-label={`${node.title} card`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(node);
              }}
            >
              <NodeCard
                ref={addNodeRef(node.uniqueId)}
                img={node.img}
                title={node.title}
                name={node.name}
                isHovered={hoveredIndex === node.uniqueId}
                onClick={() => handleCardClick(node)}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Modal */}
      <Modal visible={modalVisible} onClose={closeModal} ariaLabel="Committee member details">
        {modalData && (
          <div className="p-6">
            <button
              onClick={closeModal}
              className="float-right text-gray-500 hover:text-yellow-500 focus:outline-none"
              aria-label="Close details modal"
            >
              &times;
            </button>
            <div className="text-center">
              <img
                src={modalData.img}
                alt={modalData.title}
                className="w-28 h-28 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-800">{modalData.title}</h3>
              <p className="text-sm text-gray-700">{modalData.name}</p>
              <p className="text-sm text-gray-600 mt-4 whitespace-pre-line leading-relaxed">
                {modalData.details}
              </p>
              {modalData.memberData?.BloodGroup && (
                <p className="text-sm text-gray-600 mt-2">
                  Blood Group: {modalData.memberData.BloodGroup}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// NodeCard component
const NodeCard = React.forwardRef(({ img, title, name, isHovered, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={`text-center p-4 rounded-lg shadow-md w-36 mx-auto transition-transform duration-200
      bg-white bg-opacity-50
      backdrop-filter backdrop-blur-md
      border border-white border-opacity-30
      ${isHovered ? 'scale-105 shadow-yellow-400 border-yellow-400 bg-opacity-30' : ''}
    `}
    style={{
      WebkitBackdropFilter: 'blur(10px)',
      backdropFilter: 'blur(2px)',
      boxShadow: isHovered
        ? '0 8px 32px 0 rgba(251, 191, 36, 0.4)'
        : '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      cursor: 'pointer'
    }}
  >
    <img 
      src={img} 
      alt={title} 
      className="w-20 h-20 mx-auto rounded-full mb-3 object-cover" 
      onError={(e) => {
        e.target.src = member;
      }}
    />
    <div className="font-semibold text-base text-gray-900">{title}</div>
    <div className="text-sm text-gray-700 truncate" title={name}>{name}</div>
  </div>
));

// AnimatedPath component
function AnimatedPath({ d, highlighted }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.transition = 'stroke-dashoffset 1.2s ease-out';

    // Defer to next frame to allow the DOM to paint before animating
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });
  }, [d]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={highlighted ? '#fbbf24' : '#cbd5e1'}
      strokeWidth={highlighted ? 3 : 1.5}
      style={{ transition: 'stroke 0.3s, strokeWidth 0.3s' }}
    />
  );
}

// Modal component
function Modal({ visible, onClose, children, ariaLabel }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible && modalRef.current) {
      const closeBtn = modalRef.current.querySelector('button');
      closeBtn?.focus();
    }
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto relative"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}