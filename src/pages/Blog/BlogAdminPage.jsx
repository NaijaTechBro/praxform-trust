import React, { useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import Spinner from '../../components/Common/Spinner';
import { format } from 'date-fns';

const BlogAdminPage = () => {
    const { posts, loading, getAdminPosts, deletePost } = useBlog();

    useEffect(() => {
        getAdminPosts();
    }, [getAdminPosts]);

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            deletePost(postId);
        }
    };

    return (
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Blog Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Create, edit, and manage your organization's blog posts.</p>
                </div>
                <Link
                    to="/blog-admin/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FiPlus />
                    New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Spinner /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {posts.map(post => (
                                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{post.title}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                post.status === 'published' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' 
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400'
                                            }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <Link to={`/blog-admin/edit/${post._id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                                                <FiEdit size={16} className="inline"/>
                                            </Link>
                                            <button onClick={() => handleDelete(post._id)} className="text-red-600 dark:text-red-400 hover:text-red-800">
                                                <FiTrash2 size={16} className="inline"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogAdminPage;