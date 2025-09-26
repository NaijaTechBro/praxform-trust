import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css"; // Import the CSS
import { FiSave, FiEye } from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';
import ImageUploader from '../../components/Common/ImageUploader'; // Your reusable image uploader
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';

const BlogPostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createPost, updatePost, getPostById, currentPost, loading } = useBlog();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [metaDescription, setMetaDescription] = useState('');
    const [categories, setCategories] = useState(''); // Stored as a comma-separated string for simplicity
    const [tags, setTags] = useState('');

    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            getPostById(id);
        }
    }, [id, isEditing, getPostById]);

    useEffect(() => {
        if (isEditing && currentPost) {
            setTitle(currentPost.title);
            setContent(currentPost.content);
            setStatus(currentPost.status);
            setFeaturedImage(currentPost.featuredImage || null);
            setMetaDescription(currentPost.metaDescription || '');
            setCategories((currentPost.categories || []).join(', '));
            setTags((currentPost.tags || []).join(', '));
        }
    }, [currentPost, isEditing]);

    const handleSave = async () => {
        if (!title || !content) {
            return toast.error("Title and Content are required.");
        }

        const postData = {
            title,
            content,
            status,
            featuredImage,
            metaDescription,
            categories: categories.split(',').map(c => c.trim()).filter(Boolean),
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        };

        let result;
        if (isEditing) {
            result = await updatePost(id, postData);
        } else {
            result = await createPost(postData);
        }

        if (result) {
            navigate('/blog-admin');
        }
    };

    const mdeOptions = useMemo(() => {
        return {
            spellChecker: false,
            maxHeight: "400px",
            autofocus: true,
        };
    }, []);

    if (loading && isEditing) {
        return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {isEditing ? 'Edit Post' : 'Create New Post'}
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
                            {status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <Switch
                            checked={status === 'published'}
                            onChange={(checked) => setStatus(checked ? 'published' : 'draft')}
                            className={`${status === 'published' ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                            <span className={`${status === 'published' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                        </Switch>
                    </div>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        <FiSave /> {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Column */}
                <div className="lg:col-span-2 space-y-6">
                    <input 
                        type="text" 
                        placeholder="Post Title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        className="w-full text-3xl font-bold p-2 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:border-blue-500"
                    />
                    <SimpleMDE options={mdeOptions} value={content} onChange={setContent} />
                </div>

                {/* Sidebar for Metadata */}
                <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
                        <ImageUploader 
                            currentImageUrl={featuredImage?.url}
                            onUploadSuccess={(data) => setFeaturedImage(data)}
                            folder="blog/featured_images"
                            uniqueId="blog-featured-image"
                            placeholderText="Featured Image"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description (for SEO)</label>
                        <textarea 
                            rows="4" 
                            placeholder="A short summary for search engines (max 160 characters)."
                            maxLength="160"
                            value={metaDescription}
                            onChange={e => setMetaDescription(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categories</label>
                        <p className="text-xs text-gray-500 mb-1">Comma-separated (e.g., Security, HIPAA)</p>
                        <input 
                            type="text" 
                            value={categories}
                            onChange={e => setCategories(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                        <p className="text-xs text-gray-500 mb-1">Comma-separated (e.g., encryption, fintech)</p>
                        <input 
                            type="text" 
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostEditor;