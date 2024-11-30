import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 14,
    color: '#555',
  },
  postBox: {
    backgroundColor: '#f7f7fa',
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    marginTop:3,
    marginVertical: 1,
  },
  userImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#657', // #4682B4
  },
  postTime: {
    color: '#657',
    fontSize: 10,
    marginTop: 2,
  },
  postContent: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 25,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  mediaItem: {
    width: (width - 40) / 3,
    height: (width - 40) / 3,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaVideo: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  commentsList: {
    maxHeight: 'auto',
    marginTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#008080'
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentUserName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentText: {
    fontSize: 14,
    marginTop: 4,
  },
  commentTime: {
    fontSize: 10,
    color: '#555',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'maroon',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  submitButtonText: {
    color: '#fff',
  },
  commentsList: {
    height: 'auto',
    marginTop: 10,
  },
  dropdownContainer: {
    position: 'relative',
    marginRight: 10, // Adjust as needed for layout
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
  },
  closeText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles;
