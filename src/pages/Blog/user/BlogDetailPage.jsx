import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../../../context/BlogContext';
import Spinner from '../../../components/common/Spinner';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft } from 'react-icons/fi';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const { currentPost, loading, getPublicPostBySlug } = useBlog();

    useEffect(() => {
        if (slug) {
            getPublicPostBySlug(slug);
        }
    }, [slug, getPublicPostBySlug]);

    if (loading || !currentPost) {
        return <div className="flex h-[80vh] w-full items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8">
                    <FiArrowLeft />
                    Back to all posts
                </Link>

                {/* Post Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#030405] dark:text-gray-100 font-serif mb-4">
                        {currentPost.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
                        {currentPost.author && (
                            <div className="flex items-center gap-2">
                                <img 
                                    src={currentPost.author.avatar || `https://ui-avatars.com/api/?name=${currentPost.author.firstName}+${currentPost.author.lastName}`} 
                                    alt={currentPost.author.firstName} 
                                    className="h-8 w-8 rounded-full" 
                                />
                                <span>{currentPost.author.firstName} {currentPost.author.lastName}</span>
                            </div>
                        )}
                        <span className="hidden sm:inline">|</span>
                        <time dateTime={currentPost.createdAt}>
                            {format(new Date(currentPost.createdAt), 'MMMM d, yyyy')}
                        </time>
                    </div>
                </div>

                {/* Featured Image */}
                {currentPost.featuredImage && (
                    <img 
                        src={currentPost.featuredImage.url} 
                        alt={currentPost.title} 
                        className="w-full h-auto rounded-xl shadow-lg mb-8"
                    />
                )}

                {/* Post Content */}
                <article className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none">
                    <ReactMarkdown>{currentPost.content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
};

export default BlogDetailPage;