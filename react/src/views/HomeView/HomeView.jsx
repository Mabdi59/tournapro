import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function HomeView() {
  const user = useContext(UserContext);

  return (
    <div>
      <h1>Home</h1>
      <br />
      <p>Welcome to the home page!</p>
    </div>
  );
}