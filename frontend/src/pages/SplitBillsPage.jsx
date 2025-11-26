import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getGroups, createGroup } from '../services/group';
import { toast } from 'react-hot-toast';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SplitBillsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    members: '' // comma separated string for input
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await getGroups();
      if (res.success) {
        setGroups(res.data);
      }
    } catch (error) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const membersArray = formData.members.split(',').map(m => m.trim()).filter(m => m);
      if (membersArray.length === 0) {
        return toast.error("Please add at least one member");
      }

      await createGroup({
        name: formData.name,
        members: membersArray
      });
      
      toast.success("Group created successfully! 👥");
      setFormData({ name: '', members: '' });
      setShowForm(false);
      fetchGroups();
    } catch (error) {
      toast.error(error.message || "Failed to create group");
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Users className="w-8 h-8 text-indigo-600" />
              Split Bills
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Manage shared expenses with friends</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Create Group
          </button>
        </div>

        {showForm && (
          <div className="glass-card p-6 rounded-2xl animate-slide-down">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Create New Group</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g. Trip to Goa"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Members (comma separated)</label>
                <input
                  type="text"
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g. Alice, Bob, Charlie"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner w-10 h-10 border-indigo-500"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">No groups yet</h3>
            <p className="text-gray-500 mt-2">Create a group to start splitting bills!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link to={`/groups/${group._id}`} key={group._id}>
                <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                      {group.name[0].toUpperCase()}
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.members.length} members
                  </p>
                  <div className="mt-4 flex -space-x-2 overflow-hidden">
                    {group.members.slice(0, 4).map((member, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        {member[0]}
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SplitBillsPage;
