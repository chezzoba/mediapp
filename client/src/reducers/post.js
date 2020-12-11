const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

// Types: GET_POSTS and POST_ERROR

export default function post(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case "GET_POSTS":
      return { ...state, posts: payload, loading: false, post: null };

    case "POST_ERROR":
      return { ...state, error: payload, loading: false };

    case "UPDATE_LIKES":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.postId ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };

    case "DELETE_POST":
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post._id !== payload),
      };

    case "ADD_POST":
      return { ...state, posts: [payload, ...state.posts], loading: false };

    case "GET_POST":
      return { ...state, post: payload, loading: false };
    
    case "ADD_COMMENT":
        return {...state,
        post: {...state.post, comments: payload},
        loading: false
    };

    case "DELETE_COMMENT":
        return {...state, 
        post: {...state.post, comments: state.post.comments.filter(cm => cm._id !== payload)},
        loading: false
    };

    default:
      return state;
  }
}
