import React, { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import styled from 'styled-components';
import data from '../exam-boards/aqa.json';

const DiagramWrapper = styled.div`
  width: 100%;
  height: 100vh;
  transform: scale(2);
  
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
    if (!data) return;

    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
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
      .attr('stroke', '#bbb')
      .attr('stroke-width', 0.5);

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
          let parent = d;
          while (parent) {
            newVisibleNodes.add(parent.data.name);
            parent = parent.parent;
          }

          const [x, y] = project(d.x, d.y);
          d3.select(svgRef.current).transition()
            .duration(750)
            .attr('transform', `translate(${-x},${-y})`);

          return newVisibleNodes;
        });
      });

    const text = node.append('text')
      .attr('dy', '0.31em')
      .text(d => d.data.name)
      .style('text-anchor', 'middle')
      .style('visibility', d => (visibleNodes.has(d.data.name) || d.depth === 0) ? 'visible' : 'hidden');

    text.each(function (d) {
      d.bbox = this.getBBox();
    });

    const padding = 18;

    node.insert('rect', 'text')
      .attr('x', d => -d.bbox.width / 2 - (padding / 2))
      .attr('y', d => -d.bbox.height / 2 - (padding / 2))
      .attr('height', d => d.bbox.height + padding)
      .attr('width', d => d.bbox.width + padding)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'white')
      .style('visibility', d => (visibleNodes.has(d.data.name) || d.depth === 0) ? 'visible' : 'hidden');

    function project(x, y) {
      const angle = x - Math.PI / 2;
      return [Math.cos(angle) * y, Math.sin(angle) * y];
    }

    return () => {
      d3.select(svgRef.current).selectAll('*').remove();
    };
  }, [data, visibleNodes, focusedNode]);

  return (
    <DiagramWrapper>
      <svg ref={svgRef}></svg>
    </DiagramWrapper>
  );
};

export default SpiderDiagram;
