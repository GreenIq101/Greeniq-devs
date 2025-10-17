import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirestoreEnabled, mockStorage } from '../firebase';

// Use mock storage instead of Firestore for this demo
const blogsCollection = isFirestoreEnabled ? collection(db, 'blogs') : null;

// Add a new blog post
export const addBlog = async (blogData) => {
  if (isFirestoreEnabled) {
    try {
      const docRef = await addDoc(blogsCollection, {
        ...blogData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding blog:', error);
      // Fallback to mock storage
      return mockStorage.saveBlog(blogData);
    }
  } else {
    // Use mock storage
    return mockStorage.saveBlog(blogData);
  }
};

// Get all blog posts
export const getBlogs = async () => {
  if (isFirestoreEnabled) {
    try {
      const q = query(blogsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      return blogs;
    } catch (error) {
      console.error('Error getting blogs:', error);
      // Fallback to mock storage
      return mockStorage.getBlogs();
    }
  } else {
    // Use mock storage
    return mockStorage.getBlogs();
  }
};

// Update a blog post
export const updateBlog = async (id, blogData) => {
  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      ...blogData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlog = async (id) => {
  try {
    await deleteDoc(doc(db, 'blogs', id));
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Upload image to local public folder (instead of Firebase Storage)
export const uploadImage = async (file) => {
  try {
    // For now, we'll simulate uploading to public/blog-images
    // In a real implementation, you'd handle file upload to your server
    const fileName = `${Date.now()}-${file.name}`;
    const imageUrl = `/blog-images/${fileName}`;

    // Note: This is a placeholder. In production, you'd need a backend
    // to handle actual file uploads to the public folder
    console.log('Image would be uploaded to:', imageUrl);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};