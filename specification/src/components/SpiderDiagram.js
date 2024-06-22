import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import styled from 'styled-components';

const data = {
  name: "AQA",
  children: [
    {
      name: "Physics",
      children: [
        {
          name: "P1: Energy",
          children: [
            { name: "P1.1 Energy stores" },
            { name: "P1.2 Energy resources" },
          ],
        },
        {
          name: "P2: Electricity",
          children: [
            { name: "P2.1 Energy stores" },
            { name: "P2.2 Energy resources" },
          ],
        },
      ],
    },
    {
      name: "Biology",
      children: [
        {
          name: "B1: Energy",
          children: [
            { name: "B1.1 Energy stores" },
            { name: "B1.2 Energy resources" },
          ],
        },
        {
          name: "B2: Electricity",
          children: [
            { name: "B2.1Energy stores" },
            { name: "B2.2Energy resources" },
          ],
        },
      ],
    },
    {
      name: "Chemistry",
      children: [
        {
          name: "C1: Energy",
          children: [
            { name: "C1.1 Energy stores" },
            { name: "C1.2 Energy resources" },
          ],
        },
        {
          name: "C2: Electricity",
          children: [
            { name: "C2.1 Energy stores" },
            { name: "C2.2 Energy resources" },
          ],
        },
      ],
    },
  ],
};

const DiagramWrapper = styled.div`
  width: 100%;
  height: 100vh;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const SpiderDiagram = () => {
  const svgRef = useRef();
  const [visibleNodes, setVisibleNodes] = useState(() => {
    const initialVisibleNodes = new Set(["AQA"]);
    data.children.forEach(child => initialVisibleNodes.add(child.name));
    return initialVisibleNodes;
  });

  const [focusedNode, setFocusedNode] = useState(null);

  useEffect(() => {
    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const root = d3.hierarchy(data);

    const tree = d3.tree()
      .size([2 * Math.PI, radius - 100])
      .separation(() => 1);

    tree(root);

    const links = root.links();
    const nodes = root.descendants();

    svg.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('x1', d => project(d.source.x, d.source.y)[0])
      .attr('y1', d => project(d.source.x, d.source.y)[1])
      .attr('x2', d => project(d.target.x, d.target.y)[0])
      .attr('y2', d => project(d.target.x, d.target.y)[1])
      .attr('stroke', '#555')
      .attr('stroke-width', 1.5);

    const node = svg.selectAll('g.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${project(d.x, d.y)})`)
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        setFocusedNode(d);
        setVisibleNodes(prev => {
          const newVisibleNodes = new Set(["AQA"]);
          // Always keep subject nodes visible
          root.children.forEach(subject => newVisibleNodes.add(subject.data.name));
          if (d.depth === 2) {
            root.children.forEach(subject => {
              subject.children.forEach(unit => {
                if (unit === d) {
                  unit.children.forEach(topic => newVisibleNodes.add(topic.data.name));
                }
              });
            });
          } else if (d.depth === 1) {
            d.children.forEach(unit => newVisibleNodes.add(unit.data.name));
          }
          // Always keep parent nodes visible
          let parent = d;
          while (parent) {
            newVisibleNodes.add(parent.data.name);
            parent = parent.parent;
          }
          return newVisibleNodes;
        });
      });

    node.append('circle')
      .attr('r', 5)
      .attr('fill', d => d.children ? '#555' : '#999');

      node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => (d.x < Math.PI ? 6 : -6))
      .attr('text-anchor', d => (d.x < Math.PI ? 'start' : 'end'))
      .text(d => d.data.name)
      .style('visibility', d => (visibleNodes.has(d.data.name) || d.depth === 0) ? 'visible' : 'hidden')
      .clone(true).lower()
      .attr('stroke', 'white');
    
    
    function project(x, y) {
      const angle = x - Math.PI / 2;
      return [Math.cos(angle) * y, Math.sin(angle) * y];
    }

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [visibleNodes, focusedNode]);

  return (
    <DiagramWrapper>
      <svg ref={svgRef}></svg>
    </DiagramWrapper>
  );
};

export default SpiderDiagram;
