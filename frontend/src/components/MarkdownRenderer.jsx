import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const MarkdownRenderer = ({ content }) => {
    const cleanHtml = useMemo(() => {
        const rawHtml = marked.parse(content || '');
        return DOMPurify.sanitize(rawHtml);
    }, [content]);

    return (
        <div
            className="prose prose-invert prose-slate max-w-none prose-headings:text-blue-400 prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    );
};

export default MarkdownRenderer;
