import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import cloud from './cloud';

const WEIGHT_COLORS = ['#CAC9C9', '#B3ACFF', '#9185FF', '#654CFF', '#5A45E4', '#4E3CC6'];

function draw(words, svgEle) {
    d3.select(svgEle).selectAll('*').remove();

    d3.select(svgEle)
      .append('g')
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', (d) => `${d.size}px`)
      .style('font-weight', 'bold')
      .style('font-family', '苹方-简')
      .style('fill', (word, i: number) => {
        const { color } = word || {};
        if (color) return color;
        const colorCount = WEIGHT_COLORS.length;
        if (i === 0) {
            return WEIGHT_COLORS[colorCount - 1];
        }
        if (i + 1 === word.length) {
            return WEIGHT_COLORS[0];
        }
        return WEIGHT_COLORS[Math.floor(Math.random() * (colorCount - 1))];
      })
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text((d) => d.text);
}

interface IWord {
    text: string;
    size: number;
}
interface IProps {
    words: IWord[];
}
export const Wordcloud = (props: IProps) => {
    const { words } = props;

    const svgRef = useRef(null);

    useEffect(() => {
        const svgEle = svgRef.current;
        if (svgEle) {
            const formatWords = words.filter(Boolean).sort((a: IWord, b: IWord) => b.size - a.size)
            const { clientWidth: svgWidth, clientHeight: svgHeight } = svgEle;
            const layout = cloud()
                .size([svgWidth, svgHeight])
                .words(formatWords)
                .padding(2)
                .rotate(0)
                .fontSize((d: IWord, i: number) => {
                    const { size } = d || {};
                    if (i === 0) return svgWidth / 12;
                    if (i + 1 === formatWords.length) return svgWidth / 30;
                    return Math.max((size * svgWidth) / 15, svgWidth / 25)
                })
                .spiral('archimedean')
                .on('end', () => draw(formatWords, svgEle));  
            layout.start();
        }
    }, [words]);

    return <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>;
};

export default {
    Wordcloud,
    cloud
}