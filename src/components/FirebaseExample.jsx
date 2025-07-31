import React, { useState, useEffect } from 'react';
import { signInUser, signUpUser, createDocument, getDocuments, onAuthChange } from '../utils/firebaseUtils';

const FirebaseExample = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const result = await signInUser(email, password);
    if (result.success) {
      setMessage('Signed in successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const result = await signUpUser(email, password, { displayName: 'New User' });
    if (result.success) {
      setMessage('Account created successfully!');
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleCreateDocument = async () => {
    const result = await createDocument('examples', {
      title: 'Firebase Example',
      content: 'This is a test document',
      userId: user?.uid
    });

    if (result.success) {
      setMessage('Document created successfully!');
      loadDocuments();
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const loadDocuments = async () => {
    const result = await getDocuments('examples', [
      { field: 'userId', operator: '==', value: user?.uid }
    ]);

    if (result.success) {
      setDocuments(result.data);
    }
  };

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Example</h2>

      {!user ? (
        <div>
          <form onSubmit={handleSignIn} className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <p className="mb-4">Welcome, {user.email}!</p>
          <button
            onClick={handleCreateDocument}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mb-4"
          >
            Create Test Document
          </button>

          <div>
            <h3 className="font-bold mb-2">Your Documents:</h3>
            {documents.map((doc) => (
              <div key={doc.id} className="p-2 border rounded mb-2">
                <strong>{doc.title}</strong>
                <p>{doc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default FirebaseExample;
