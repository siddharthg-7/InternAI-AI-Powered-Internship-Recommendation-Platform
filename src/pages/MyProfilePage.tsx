import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaBriefcase, FaCode, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function MyProfilePage() {
  const { user, logout } = useAuth();
  const { profile } = useAppState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
        </div>

        {/* User Card */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full border-2 border-primary/20" />
            ) : (
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <FaUser className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {user?.displayName || "Guest User"}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email || "Not signed in"}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <FaSignOutAlt className="w-3.5 h-3.5 mr-2" /> Sign Out
          </Button>
        </div>

        {/* Saved Profile Details */}
        {profile ? (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
              Saved Profile Details
            </h3>

            <ProfileItem
              icon={<FaGraduationCap className="w-4 h-4" />}
              label="Education"
              value={profile.education}
            />
            <ProfileItem
              icon={<FaBriefcase className="w-4 h-4" />}
              label="Field of Study"
              value={profile.fieldOfStudy}
            />
            <ProfileItem
              icon={<FaMapMarkerAlt className="w-4 h-4" />}
              label="Location Preference"
              value={profile.location}
            />
            <ProfileItem
              icon={<FaBriefcase className="w-4 h-4" />}
              label="Career Interest"
              value={profile.interest}
            />
            <ProfileItem
              icon={<FaBriefcase className="w-4 h-4" />}
              label="Experience Level"
              value={profile.experience}
            />

            {/* Skills */}
            <div className="glass-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaCode className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={() => navigate("/profile")}
              className="w-full gradient-primary text-primary-foreground rounded-xl py-5 mt-4"
            >
              Edit Profile
            </Button>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-8 text-center">
            <FaUser className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Profile Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fill in your profile to get personalized internship recommendations.
            </p>
            <Button
              onClick={() => navigate("/profile")}
              className="gradient-primary text-primary-foreground rounded-xl"
            >
              Create Profile
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-panel rounded-xl p-4 flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
