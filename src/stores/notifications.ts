import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => {
    return {
      notifications: {
        // searchingForAJob: {
        //   name: 'Searching for a job',
        //   isEnabled: true,
        // },
        hiringSomeone: {
          name: 'Add some members',
          isEnabled: false,
        },
        connectingWithOthers: {
          name: 'Connecting with others',
          isEnabled: true,
        },
        postingAndCommenting: {
          name: 'Adding third party',
          isEnabled: true,
        },
        messaging: {
          name: 'Messaging',
          isEnabled: true,
        },
        groups: {
          name: 'Groups',
          isEnabled: false,
        },
        pages: {
          name: 'Pages',
          isEnabled: true,
        },
        attendingEvents: {
          name: 'Attending events',
          isEnabled: true,
        },
        newsAndReports: {
          name: 'News and reports',
          isEnabled: false,
        },
        updatingYourProfile: {
          name: 'Updating your profile',
          isEnabled: true,
        },
        verifications: {
          name: 'Verifications',
          isEnabled: true,
        },
      },
    }
  },
})
