import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../../context/BlogContext';
import Spinner from '../../../components/common/Spinner';
import { format } from 'date-fns';

const BlogListPage = () => {
    const { publishedPosts, loading, getPublicPosts } = useBlog();

    useEffect(() => {
        getPublicPosts();
    }, [getPublicPosts]);

    return (
        <div className="bg-white dark:bg-gray-900 py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#030405] dark:text-gray-100 font-serif mb-4">
                        The PraxForm Blog
                    </h1>
                    <p className="text-lg md:text-xl text-[#5F80A0] dark:text-gray-400">
                        Insights on security, compliance, and building trust with your clients.
                    </p>
                </div>

                {/* Post List */}
                <div className="space-y-12">
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Spinner /></div>
                    ) : (
                        publishedPosts.map(post => (
                            <article key={post._id} className="group">
                                <Link to={`/blog/${post.slug}`} className="block">
                                    {post.featuredImage && (
                                        <div className="mb-4 overflow-hidden rounded-xl shadow-lg">
                                            <img 
                                                src={post.featuredImage.url} 
                                                alt={post.title} 
                                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                                            />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        <time dateTime={post.createdAt}>
                                            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                                        </time>
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
                                        {post.metaDescription || post.content.substring(0, 150) + '...'}
                                    </p>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                                        Read more &rarr;
                                    </span>
                                </Link>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogListPage;