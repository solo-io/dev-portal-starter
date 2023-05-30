import { useState } from "react";
import { Button } from "../Common/Button";
import LoginModal from "../Login/LoginModal";

const HeaderSectionLoggedOut = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="userLoginArea loggedOut">
      <Button onClick={() => setShowLoginModal(true)}>LOGIN</Button>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default HeaderSectionLoggedOut;
