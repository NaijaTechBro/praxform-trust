

import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const BlogContext = createContext();

export const useBlog = () => {
    return useContext(BlogContext);
};

export const BlogProvider = ({ children }) => {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]); // For admin list
    const [publishedPosts, setPublishedPosts] = useState([]); // For public list
    const [currentPost, setCurrentPost] = useState(null); // For single post view/edit
    const [latestPost, setLatestPost] = useState(null); // For hero badge
    const [loading, setLoading] = useState(false);
    
    // Base URL for blog routes, assuming your router is mounted at '/api/v1/blog'
    const API_BASE_URL = `${import.meta.env.VITE_API_URL}/blog`; 

    // --- PUBLIC FUNCTIONS ---

    const getPublicPosts = useCallback(async () => {
        setLoading(true);
        try {
            // GET /api/v1/blog
            const { data } = await axios.get(API_BASE_URL);
            setPublishedPosts(data.data);
        } catch (error) {
            toast.error('Failed to fetch blog posts.');
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    const getPublicPostBySlug = useCallback(async (slug) => {
        setLoading(true);
        setCurrentPost(null);
        try {
            // GET /api/v1/blog/:slug
            const { data } = await axios.get(`${API_BASE_URL}/${slug}`);
            setCurrentPost(data.data);
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Blog post not found.');
            return null;
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);

    const getLatestPost = useCallback(async () => {
        try {
            // GET /api/v1/blog/posts/latest (Matches your router's specific path)
            const { data } = await axios.get(`${API_BASE_URL}/latest`);
            setLatestPost(data.data);
        } catch (error) {
            console.error('Failed to fetch latest post:', error);
        }
    }, [API_BASE_URL]);

    
    // --- ADMIN FUNCTIONS ---

    const getAdminPosts = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // GET /api/v1/blog/admin/all
            const { data } = await axios.get(`${API_BASE_URL}/admin/all`, config);
            setPosts(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch admin posts.");
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    const getPostById = useCallback(async (postId) => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // GET /api/v1/blog/admin/:id
            const { data } = await axios.get(`${API_BASE_URL}/admin/${postId}`, config);
            setCurrentPost(data.data);
            return data.data;
        } catch (error) {
            toast.error("Failed to fetch post for editing.");
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    const createPost = useCallback(async (postData) => {
        if (!token) return null;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // POST /api/v1/blog/admin
            const { data } = await axios.post(`${API_BASE_URL}/admin`, postData, config);
            toast.success("Post created successfully!");
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    const updatePost = useCallback(async (postId, postData) => {
        if (!token) return null;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // PUT /api/v1/blog/admin/:id
            const { data } = await axios.put(`${API_BASE_URL}/admin/${postId}`, postData, config);
            toast.success("Post updated successfully!");
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update post.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    const deletePost = useCallback(async (postId) => {
        if (!token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // DELETE /api/v1/blog/admin/:id
            await axios.delete(`${API_BASE_URL}/admin/${postId}`, config);
            toast.success("Post deleted successfully.");
            // Update admin posts list locally
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete post.");
        }
    }, [token, API_BASE_URL]);

    
    const value = {
        posts,
        publishedPosts,
        currentPost,
        latestPost,
        loading,
        getAdminPosts,
        getPostById,
        createPost,
        updatePost,
        deletePost,
        getPublicPosts,
        getPublicPostBySlug,
        getLatestPost,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};